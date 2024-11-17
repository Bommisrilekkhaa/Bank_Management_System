package filter;

import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import enums.Resources;
import utility.JsonUtil;
import utility.LoggerConfig;

@SuppressWarnings("serial")
public class AuthFilter extends HttpFilter implements Filter {
	Gson gson = new Gson();
	private Logger logger = LoggerConfig.initializeLogger();

	public AuthFilter() {
		super();

	}

	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {
		// System.out.println("start");

		HttpServletRequest req = (HttpServletRequest) request;
		HttpServletResponse res = (HttpServletResponse) response;
		Cookie[] cookies = req.getCookies();

		// System.out.println("cookie"+req.getCookies());
		String[] path = req.getRequestURI().split("/");

		String sessionData = null;
		for (Cookie cookie : cookies) {
//			System.out.println(cookie.getName());
			if ("sessionData".equals(cookie.getName())) {
				sessionData = cookie.getValue();
				String decodedValue = URLDecoder.decode(cookie.getValue(), StandardCharsets.UTF_8.toString());
				
				String jsonValue = decodedValue.replaceFirst("^cookie", "");
				
				JsonObject jsonObject = gson.fromJson(jsonValue, JsonObject.class);
				
				String authToken = jsonObject.get("authToken").getAsString();
				
				if (authToken != null && authToken.equals(req.getSession(false).getId())) {
					logger.info("Valid Session Found, Redirecting the request servlet!");
					chain.doFilter(request, response);
					return;
				} else {
					logger.info("Invalid session!!");
					JsonUtil.sendErrorResponse((HttpServletResponse) response, "Invalid session");
					return;
				}
			}
		}
		
		if (sessionData == null) {
			if (path[path.length - 1].equals("auth") || path[path.length - 1].equals(Resources.BANKS.toString().toLowerCase())) {
				// System.out.println("Login request, skipping auth filter.");
				logger.info("Login request, skipping auth filter!");
				chain.doFilter(request, response);
				return;
			}
			logger.log(Level.SEVERE, "No cookies present, user is not logged in.");
			JsonUtil.sendErrorResponse(res, "No cookies present, user is not logged in.");
			return;
		}

			

		// System.out.println("bye");

	}

}
