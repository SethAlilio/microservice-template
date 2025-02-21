package com.gateway.edge.service.config;

/**
 * Created by Default on 21/04/2022.
 */
import com.gateway.edge.service.security.AuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class SpringCloudConfig {

    private final AuthenticationFilter filter;

    @Bean
    public RouteLocator gatewayRoutes(RouteLocatorBuilder builder){
        return builder.routes()

                .route("rental-assets-service", r -> r.path("/rentalassetsservice/**")
                        .filters(f -> f.filter(filter))
                        .uri("lb://rental-assets-service"))

                .route("fixed-assets-service", r -> r.path("/fixedassets/**")
                        .filters(f -> f.filter(filter))
                        .uri("lb://fixed-assets-service"))

                .route("tools-and-equipment-service", r -> r.path("/toolsandequipment/**","/toolsandequipment/equip/**")
                       .filters(f -> f.filter(filter))
                .uri("lb://tools-and-equipment-service"))

                .route("account-service", r -> r.path("/account/**")
                       .filters(f -> f.filter(filter))
                .uri("lb://account-service"))

                .route("auth-service", r -> r.path("/auth/**")
                       .filters(f -> f.filter(filter))
                .uri("lb://auth-service"))

                .route("workorder-service", r -> r.path("/workorder/**","/installorder/**")
                        .filters(f -> f.filter(filter))
                .uri("lb://workorder-service"))

                .route("system-service", r -> r.path("/resource/**","/system/**","/fhuser/**",
                                "/contactassets/**","/projects/**","/announcements/**","/te-datadict-list/**") //"/redis/**",
                        .filters(f -> f.filter(filter))
                        .uri("lb://system-service"))

                .route("summary-report-service", r -> r.path("/summary-report/**")
                        .filters(f -> f.filter(filter))
                        .uri("lb://summary-report-service"))

                .route( "te-ledger-service", r -> r.path("/te-ledger/**")
                        .filters(f -> f.filter(filter))
                        .uri("lb://te-ledger-service"))

                .route( "ipgfa-ledger-service", r -> r.path("/ipgfa-ledger/**")
                        .filters(f -> f.filter(filter))
                        .uri("lb://ipgfa-ledger-service"))

                .build();
    }
}