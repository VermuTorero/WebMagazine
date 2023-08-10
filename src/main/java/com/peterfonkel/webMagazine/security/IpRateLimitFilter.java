package com.peterfonkel.webMagazine.security;

import org.springframework.stereotype.Component;
import javax.servlet.*;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class IpRateLimitFilter implements Filter {

    private final Map<String, Long> requestCounts = new ConcurrentHashMap<>();
    private final long timeWindowInMillis = 60000; // 1 minuto
    private final int maxRequestsPerWindow = 60;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        String clientIp = request.getRemoteAddr();

        if (!isAllowed(clientIp)) {
            HttpServletResponse httpResponse = (HttpServletResponse) response;
            httpResponse.setStatus(HttpServletResponse.SC_SERVICE_UNAVAILABLE);
            httpResponse.getWriter().write("Too many requests from your IP address.");
            return;
        }

        chain.doFilter(request, response);
    }

    private synchronized boolean isAllowed(String clientIp) {
        long currentTime = System.currentTimeMillis();
        requestCounts.entrySet().removeIf(entry -> entry.getValue() < currentTime - timeWindowInMillis);

        requestCounts.putIfAbsent(clientIp, currentTime);
        return requestCounts.get(clientIp) >= currentTime - timeWindowInMillis
                && requestCounts.getOrDefault(clientIp, 0L) < maxRequestsPerWindow;
    }

    @Override
    public void init(FilterConfig filterConfig) {
    }

    @Override
    public void destroy() {
    }
}