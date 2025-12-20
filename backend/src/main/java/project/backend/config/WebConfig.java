package project.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Cấu hình Web MVC cho ứng dụng.
 * Dùng để cấu hình phục vụ các tài nguyên tĩnh (static resources) như hình ảnh, CSS, JS.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * Cấu hình Resource Handlers để phục vụ các tệp tĩnh.
     * Cụ thể, map đường dẫn URL /uploads/** tới thư mục 'uploads/' trên server.
     *
     * @param registry ResourceHandlerRegistry
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Ánh xạ URL /uploads/** tới thư mục uploads nằm ở thư mục gốc của project
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }
}
