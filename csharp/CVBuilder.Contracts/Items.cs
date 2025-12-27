namespace CVBuilder.Contracts
{
    public class User : DbItem
    {
        public string UserId { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string Picture { get; set; } // filename only
        public string GoogleId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime LastLoginAt { get; set; } = DateTime.UtcNow;

        // TO / FROM methods for API contract mapping
        public static User FromContract(UserContract contract)
        {
            return new User
            {
                UserId = contract.UserId,
                Email = contract.Email,
                Name = contract.Name,
                Picture = contract.Picture,
                GoogleId = contract.GoogleId,
                CreatedAt = contract.CreatedAt,
                LastLoginAt = contract.LastLoginAt
            };
        }

        public UserContract ToContract()
        {
            return new UserContract
            {
                UserId = this.UserId,
                Email = this.Email,
                Name = this.Name,
                Picture = this.Picture,
                GoogleId = this.GoogleId,
                CreatedAt = this.CreatedAt,
                LastLoginAt = this.LastLoginAt
            };
        }
    }
}