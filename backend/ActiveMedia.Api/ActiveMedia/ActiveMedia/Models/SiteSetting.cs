using System.Text.Json.Serialization;

namespace ActiveMedia.Api.Models;

public class SiteSetting
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = "global";

    [JsonPropertyName("showreel_vimeo_id")]
    public string? ShowreelVimeoId { get; set; }

    [JsonPropertyName("manual_clients_count")]
    public int ManualClientsCount { get; set; }

    [JsonPropertyName("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
