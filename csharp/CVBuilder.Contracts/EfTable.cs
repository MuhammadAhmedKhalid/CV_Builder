using Microsoft.EntityFrameworkCore;

namespace CVBuilder.Contracts
{
    public class EfTable<T> where T : DbItem
    {
        private readonly DbContext _dbContext;

        public EfTable(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // Create a new item
        public async Task<EfItem<T>> CreateItemAsync(T item)
        {
            if (string.IsNullOrEmpty(item.Id))
                throw new DbUpdateException("Item Id cannot be null or empty");

            var efItem = new EfItem<T>
            {
                Id = item.Id,
                Content = item
            };

            try
            {
                await _dbContext.AddAsync(efItem);
                await _dbContext.SaveChangesAsync();
                return efItem;
            }
            catch (Exception ex)
            {
                var innerException = ex.InnerException?.Message ?? ex.Message;
                Console.WriteLine($"Database error creating item: {innerException}");
                throw new DbUpdateException($"Error creating item in the database: {innerException}", ex);
            }
        }

        // Replace an existing item
        public async Task<EfItem<T>> ReplaceItemAsync(T item)
        {
            if (string.IsNullOrEmpty(item.Id))
                throw new DbUpdateException("Item Id cannot be null or empty");

            var efItem = await _dbContext.Set<EfItem<T>>().FindAsync(item.Id);
            if (efItem == null) throw new DbUpdateException("Item not found");

            efItem.Content = item;

            try
            {
                await _dbContext.SaveChangesAsync();
                return efItem;
            }
            catch (Exception ex)
            {
                throw new DbUpdateException("Error replacing item in the database", ex);
            }
        }

        // Delete an item by id
        public async Task DeleteItemAsync(string id)
        {
            if (string.IsNullOrEmpty(id))
                throw new DbUpdateException("Id cannot be null or empty");

            var efItem = await _dbContext.Set<EfItem<T>>().FindAsync(id);
            if (efItem != null)
            {
                _dbContext.Remove(efItem);
                try
                {
                    await _dbContext.SaveChangesAsync();
                }
                catch (Exception ex)
                {
                    throw new DbUpdateException("Error deleting item in the database", ex);
                }
            }
        }

        // Get single item by id
        public async Task<EfItem<T>> GetItemAsync(string id)
        {
            return await _dbContext.Set<EfItem<T>>().FindAsync(id);
        }

        // Get single item by id, return null if not found
        public async Task<EfItem<T>?> GetItemOrDefaultAsync(string id)
        {
            return await _dbContext.Set<EfItem<T>>().FirstOrDefaultAsync(x => x.Id == id);
        }

        // Get all items
        public async Task<List<EfItem<T>>> GetItemsAsync()
        {
            return await _dbContext.Set<EfItem<T>>().ToListAsync();
        }

        // Get single item by predicate (strongly typed)
        public async Task<T?> GetItemOrDefaultAsync(Func<T, bool> predicate)
        {
            return _dbContext.Set<EfItem<T>>()
                             .Select(e => e.Content)
                             .FirstOrDefault(predicate);
        }
    }
}