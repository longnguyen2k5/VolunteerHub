package project.backend.config;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Converter tùy chỉnh để chuyển đổi JWT thành Authentication Token.
 * Class này có nhiệm vụ trích xuất các quyền (authorities) từ JWT, bao gồm cả các quyền mặc định và quyền tùy chỉnh (custom claims).
 */
@Component
public class JwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    // Converter mặc định của Spring Security để lấy authorities từ scope/scp claim
    private final JwtGrantedAuthoritiesConverter defaultGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();

    /**
     * Chuyển đổi đối tượng JWT thành AbstractAuthenticationToken (JwtAuthenticationToken).
     *
     * @param jwt JWT token
     * @return Đối tượng Authentication chứa thông tin user và các quyền hạn
     */
    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        // Kết hợp authorities từ converter mặc định và từ custom claim "authorities"
        Collection<GrantedAuthority> authorities = Stream.concat(
                defaultGrantedAuthoritiesConverter.convert(jwt).stream(),
                extractAuthorities(jwt).stream()
        ).collect(Collectors.toSet());

        return new JwtAuthenticationToken(jwt, authorities);
    }

    /**
     * Trích xuất danh sách authorities từ claim tùy chỉnh có tên "authorities" trong JWT.
     *
     * @param jwt JWT token
     * @return Danh sách GrantedAuthority
     */
    private Collection<GrantedAuthority> extractAuthorities(Jwt jwt) {
        List<String> authorities = jwt.getClaimAsStringList("authorities");
        
        if (authorities != null) {
            return authorities.stream()
                    .map(SimpleGrantedAuthority::new)
                    .collect(Collectors.toList());
        }
        
        return List.of();
    }
}
