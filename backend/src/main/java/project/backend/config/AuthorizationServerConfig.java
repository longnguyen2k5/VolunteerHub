package project.backend.config;

import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.ClientAuthenticationMethod;
import org.springframework.security.oauth2.core.oidc.OidcScopes;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.server.authorization.JdbcOAuth2AuthorizationConsentService;
import org.springframework.security.oauth2.server.authorization.JdbcOAuth2AuthorizationService;
import org.springframework.security.oauth2.server.authorization.OAuth2AuthorizationConsentService;
import org.springframework.security.oauth2.server.authorization.OAuth2AuthorizationService;
import org.springframework.security.oauth2.server.authorization.client.JdbcRegisteredClientRepository;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClient;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClientRepository;
import org.springframework.security.oauth2.server.authorization.config.annotation.web.configuration.OAuth2AuthorizationServerConfiguration;
import org.springframework.security.oauth2.server.authorization.settings.AuthorizationServerSettings;
import org.springframework.security.oauth2.server.authorization.settings.ClientSettings;
import org.springframework.security.oauth2.server.authorization.settings.TokenSettings;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.time.Duration;
import java.util.UUID;

/**
 * Cấu hình Authorization Server sử dụng Spring Security OAuth2.
 * Định nghĩa các bean cần thiết như RegisteredClientRepository, AuthorizationService, JWKSource, etc.
 */
@Configuration
public class AuthorizationServerConfig {

    /**
     * Bean RegisteredClientRepository để quản lý thông tin các OAuth2 clients.
     * Sử dụng JdbcTemplate để lưu trữ thông tin client trong cơ sở dữ liệu.
     *
     * @param jdbcTemplate JdbcTemplate để tương tác với DB
     * @return RegisteredClientRepository
     */
    @Bean
    public RegisteredClientRepository registeredClientRepository(JdbcTemplate jdbcTemplate) {
        JdbcRegisteredClientRepository repository = new JdbcRegisteredClientRepository(jdbcTemplate);

        // Kiểm tra xem client mặc định đã tồn tại chưa, nếu chưa thì tạo mới
        RegisteredClient existingClient = repository.findByClientId("volunteerhub-client");
        if (existingClient == null) {
            RegisteredClient registeredClient = RegisteredClient.withId(UUID.randomUUID().toString())
                    .clientId("volunteerhub-client")
                    // Cấu hình Client Authentication Method là NONE cho Public Client (SPA, Mobile)
                    .clientAuthenticationMethod(ClientAuthenticationMethod.NONE)
                    // Hỗ trợ Authorization Code Grant và Refresh Token Grant
                    .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                    .authorizationGrantType(AuthorizationGrantType.REFRESH_TOKEN)
                    // Cấu hình các Redirect URI cho phép
                    .redirectUri("http://localhost:3000/callback")
                    .redirectUri("http://localhost:3000/authorized")
                    // Cấu hình các Scope được phép
                    .scope(OidcScopes.OPENID)
                    .scope(OidcScopes.PROFILE)
                    .scope(OidcScopes.EMAIL)
                    .scope("read")
                    .scope("write")
                    // Cấu hình Client Settings, bắt buộc sử dụng PKCE cho bảo mật
                    .clientSettings(ClientSettings.builder()
                            .requireAuthorizationConsent(false)
                            .requireProofKey(true) // Yêu cầu Proof Key for Code Exchange (PKCE)
                            .build())
                    // Cấu hình thời gian sống của Token
                    .tokenSettings(TokenSettings.builder()
                            .accessTokenTimeToLive(Duration.ofHours(2))
                            .refreshTokenTimeToLive(Duration.ofDays(30))
                            .reuseRefreshTokens(false)
                            .build())
                    .build();

            repository.save(registeredClient);
        }

        return repository;
    }

    /**
     * Bean OAuth2AuthorizationService để quản lý trạng thái authorization (codes, tokens, v.v.).
     * Sử dụng JDBC để lưu trữ bền vững.
     *
     * @param jdbcTemplate               JdbcTemplate
     * @param registeredClientRepository Repository chứa thông tin client
     * @return OAuth2AuthorizationService
     */
    @Bean
    public OAuth2AuthorizationService authorizationService(
            JdbcTemplate jdbcTemplate,
            RegisteredClientRepository registeredClientRepository) {
        return new JdbcOAuth2AuthorizationService(jdbcTemplate, registeredClientRepository);
    }

    /**
     * Bean OAuth2AuthorizationConsentService để quản lý sự đồng ý (consent) của người dùng.
     *
     * @param jdbcTemplate               JdbcTemplate
     * @param registeredClientRepository Repository chứa thông tin client
     * @return OAuth2AuthorizationConsentService
     */
    @Bean
    public OAuth2AuthorizationConsentService authorizationConsentService(
            JdbcTemplate jdbcTemplate,
            RegisteredClientRepository registeredClientRepository) {
        return new JdbcOAuth2AuthorizationConsentService(jdbcTemplate, registeredClientRepository);
    }

    /**
     * Bean JWKSource cung cấp khóa RSA để ký các JWT token.
     *
     * @return JWKSource chứa RSA key pair
     */
    @Bean
    public JWKSource<SecurityContext> jwkSource() {
        KeyPair keyPair = generateRsaKey();
        RSAPublicKey publicKey = (RSAPublicKey) keyPair.getPublic();
        RSAPrivateKey privateKey = (RSAPrivateKey) keyPair.getPrivate();

        RSAKey rsaKey = new RSAKey.Builder(publicKey)
                .privateKey(privateKey)
                .keyID(UUID.randomUUID().toString())
                .build();

        JWKSet jwkSet = new JWKSet(rsaKey);
        return new ImmutableJWKSet<>(jwkSet);
    }

    /**
     * Helper method để tạo RSA Key Pair độ dài 2048 bit.
     *
     * @return KeyPair
     */
    private static KeyPair generateRsaKey() {
        KeyPair keyPair;
        try {
            KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
            keyPairGenerator.initialize(2048);
            keyPair = keyPairGenerator.generateKeyPair();
        } catch (Exception ex) {
            throw new IllegalStateException(ex);
        }
        return keyPair;
    }

    /**
     * Bean JwtDecoder để giải mã JWT token (dùng cho Authorization Server để validate token).
     *
     * @param jwkSource Nguồn chứa public key để verify signature
     * @return JwtDecoder
     */
    @Bean
    public JwtDecoder jwtDecoder(JWKSource<SecurityContext> jwkSource) {
        return OAuth2AuthorizationServerConfiguration.jwtDecoder(jwkSource);
    }

    /**
     * Bean AuthorizationServerSettings để cấu hình các endpoint của Authorization Server.
     *
     * @return AuthorizationServerSettings
     */
    @Bean
    public AuthorizationServerSettings authorizationServerSettings() {
        return AuthorizationServerSettings.builder()
                .issuer("http://localhost:8386")
                .build();
    }
}