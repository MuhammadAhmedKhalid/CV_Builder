using CVBuilder.Contracts;
using Microsoft.EntityFrameworkCore;

namespace CVBuilder.Migrations
{
    // Marker DbContext for EF Core migrations
    public class MigrationsDbContext : AppDbContext
    {
        public MigrationsDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }
    }
}
