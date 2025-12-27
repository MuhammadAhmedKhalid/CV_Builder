using CVBuilder.Contracts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace CVBuilder.Migrations
{
    public class AppDbContextFactory
        : IDesignTimeDbContextFactory<MigrationsDbContext>
    {
        public MigrationsDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();

            // NOTE: Connection string here MUST match Server appsettings.json
            optionsBuilder.UseNpgsql(
                "Host=localhost;Port=5432;Database=cv_builder;Username=postgres;Password=postgres",
                b => b.MigrationsAssembly("CVBuilder.Migrations")
            );

            return new MigrationsDbContext(optionsBuilder.Options);
        }
    }
}
