using System.Net;
using System.Security.Cryptography;
using System.Text;

namespace backend.Helpers;

/// <summary>
/// VNPay v2.1.0 payment helper.
/// Hash rule (from official PHP/Java samples):
///   rawData = UrlEncode(key1)=UrlEncode(val1)&UrlEncode(key2)=UrlEncode(val2)...
///   sorted alphabetically by key (case-sensitive, ordinal)
/// </summary>
public class VnpayHelper
{
    private readonly SortedList<string, string> _params =
        new(StringComparer.Ordinal);

    public void AddRequestData(string key, string value)
    {
        if (!string.IsNullOrEmpty(value))
            _params[key] = value;
    }

    public string CreatePaymentUrl(string baseUrl, string hashSecret)
    {
        // Both hash and URL use the same URL-encoded format (WebUtility = PHP urlencode)
        var sb = new StringBuilder();
        foreach (var kv in _params)
        {
            sb.Append(WebUtility.UrlEncode(kv.Key));
            sb.Append('=');
            sb.Append(WebUtility.UrlEncode(kv.Value));
            sb.Append('&');
        }

        // Remove trailing '&'
        if (sb.Length > 0) sb.Length--;

        var rawData = sb.ToString();
        var secureHash = HmacSha512(hashSecret, rawData);

        return $"{baseUrl}?{rawData}&vnp_SecureHash={secureHash}";
    }

    /// <summary>
    /// Called on return — ASP.NET already URL-decoded the query params,
    /// so we re-encode them to rebuild the exact same rawData VNPay signed.
    /// </summary>
    public static bool ValidateSignature(IQueryCollection query, string hashSecret)
    {
        var receivedHash = query["vnp_SecureHash"].ToString();
        if (string.IsNullOrEmpty(receivedHash)) return false;

        var sorted = new SortedList<string, string>(StringComparer.Ordinal);
        foreach (var key in query.Keys)
        {
            if (key == "vnp_SecureHash" || key == "vnp_SecureHashType") continue;
            sorted[key] = query[key].ToString();
        }

        var sb = new StringBuilder();
        foreach (var kv in sorted)
        {
            sb.Append(WebUtility.UrlEncode(kv.Key));
            sb.Append('=');
            sb.Append(WebUtility.UrlEncode(kv.Value));
            sb.Append('&');
        }
        if (sb.Length > 0) sb.Length--;

        var computed = HmacSha512(hashSecret, sb.ToString());
        return computed.Equals(receivedHash, StringComparison.OrdinalIgnoreCase);
    }

    private static string HmacSha512(string key, string data)
    {
        using var hmac = new HMACSHA512(Encoding.UTF8.GetBytes(key));
        var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(data));
        return BitConverter.ToString(hash).Replace("-", "").ToLowerInvariant();
    }

    public static string GetClientIp(HttpContext context)
    {
        var ip = context.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";
        return ip == "::1" ? "127.0.0.1" : ip;
    }
}
