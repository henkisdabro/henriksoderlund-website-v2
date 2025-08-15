# CSP Nonce Implementation - Next Steps

## 🎯 **Current Status: Core Functionality Complete**

The CSP nonce functionality has been successfully implemented and tested using Scott Helme's proven pattern. The core security features are working perfectly:

- ✅ Dynamic nonce generation per request
- ✅ HTML nonce injection working
- ✅ CSP headers with nonces properly set
- ✅ SPA routing compatible
- ✅ All security headers implemented

## 🚨 **Current Issue: Static Asset Serving**

**Problem**: Static assets (CSS, JS, images) return 404 because we disabled Cloudflare's assets binding to enable nonce functionality.

**Impact**: The HTML loads with proper nonces, but the React app can't fully render without its assets.

## 📋 **Next Steps (Choose One Path)**

### **Option 1: Hybrid Approach (Recommended)**
Re-enable assets binding for static files while maintaining nonce functionality for HTML.

**Steps:**
1. Restore assets binding in `wrangler.json`:
   ```json
   "assets": { "directory": "./dist/client" }
   ```

2. Modify worker to only intercept HTML requests, not all requests:
   ```typescript
   // Only apply nonce middleware to HTML responses
   app.use('*', async (c, next) => {
     await next();
     
     // Only process if it's an HTML response from assets or our routes
     const contentType = c.res.headers.get('content-type');
     if (contentType?.includes('text/html')) {
       // Apply nonce processing
     }
   });
   ```

3. Remove the custom static file handler and let Cloudflare serve assets directly

**Pros**: Leverages Cloudflare's optimized asset serving while maintaining nonce security
**Cons**: More complex setup, need to ensure HTML requests are intercepted

### **Option 2: Full Worker-Based Serving**
Implement complete static file serving within the worker.

**Steps:**
1. Create a build-time asset embedding system
2. Use Cloudflare Workers KV or R2 for asset storage
3. Implement proper MIME type detection and caching headers
4. Add asset compression and optimization

**Pros**: Full control over all requests and responses
**Cons**: More complex, potential performance impact, increased worker size

### **Option 3: Use Cloudflare Workers Assets (New)**
Explore Cloudflare's newer Workers Assets feature for better integration.

**Steps:**
1. Research latest Cloudflare Workers Assets capabilities
2. Check if it supports HTML response transformation
3. Migrate to the new assets system if compatible

## 🔧 **Technical Files to Review**

### **Core Implementation Files:**
- `src/worker/index.ts` - Main worker with nonce middleware
- `dist/henriksoderlund_website_v2/wrangler.json` - Worker configuration (assets disabled)
- `vite.config.ts` - Vite build configuration with nonce placeholder

### **Test Commands:**
```bash
# Start development server
npx wrangler dev

# Test nonce functionality
curl -s http://127.0.0.1:8787 | grep "nonce"

# Check CSP headers
curl -I http://127.0.0.1:8787 | grep -i "content-security-policy"
```

## 📊 **Performance Considerations**

**Current Impact**: 1-4ms per HTML request for nonce processing (minimal)

**Optimization Opportunities:**
- Cache nonce generation if same user/session
- Optimize HTML replacement regex patterns
- Consider server-side rendering optimizations

## 🔒 **Security Validation Checklist**

Before going to production, verify:

- [ ] CSP nonce values are unique per request
- [ ] No `'unsafe-inline'` or `'unsafe-eval'` in script-src (except where absolutely necessary)
- [ ] External scripts (Calendly, analytics) are properly whitelisted
- [ ] All inline scripts and styles have nonces
- [ ] CSP violations are monitored in production
- [ ] HSTS and other security headers are properly set

## 🌐 **Deployment Strategy**

### **Staging Deployment:**
1. Deploy to Cloudflare Workers preview environment
2. Test all CSP functionality with real external scripts
3. Monitor CSP violation reports
4. Performance test with real traffic patterns

### **Production Rollout:**
1. Enable CSP in report-only mode initially
2. Monitor violations and adjust whitelist as needed
3. Gradually enforce CSP policy
4. Set up monitoring and alerting for CSP violations

## 📚 **Reference Materials**

- [Scott Helme's CSP Nonces with Cloudflare Workers](https://scotthelme.co.uk/csp-nonces-the-easy-way-with-cloudflare-workers/)
- [Cloudflare Workers Assets Documentation](https://developers.cloudflare.com/workers/static-assets/)
- [Content Security Policy Specification](https://www.w3.org/TR/CSP3/)
- [CSP Evaluator Tool](https://csp-evaluator.withgoogle.com/)

## 🎯 **Success Metrics**

- [ ] Zero CSP violations in production
- [ ] All external scripts loading correctly
- [ ] No performance degradation (< 5ms impact)
- [ ] Security headers scoring A+ on securityheaders.com
- [ ] React application fully functional with nonces

## 💡 **Additional Features to Consider**

1. **CSP Reporting**: Set up CSP violation reporting endpoint
2. **Nonce Rotation**: Implement nonce rotation strategies
3. **Cache Optimization**: Optimize caching for assets vs HTML
4. **Monitoring**: Add detailed logging and metrics
5. **A/B Testing**: Test CSP impact on user experience

---

**Last Updated**: August 15, 2025  
**Branch**: Current implementation on main branch  
**Status**: Core nonce functionality complete, asset serving needs resolution