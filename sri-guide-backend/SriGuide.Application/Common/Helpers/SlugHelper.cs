using System.Text.RegularExpressions;
using System.Text;

namespace SriGuide.Application.Common.Helpers;

public static class SlugHelper
{
    public static string GenerateSlug(string text)
    {
        if (string.IsNullOrEmpty(text))
            return string.Empty;

        var str = text.ToLowerInvariant();

        // Remove invalid chars
        str = Regex.Replace(str, @"[^a-z0-9\s-]", "");
        // Convert multiple spaces into one space
        str = Regex.Replace(str, @"\s+", " ").Trim();
        // Cut and trim
        str = str.Substring(0, str.Length <= 45 ? str.Length : 45).Trim();
        // Hyphens
        str = Regex.Replace(str, @"\s", "-");

        return str;
    }
}
