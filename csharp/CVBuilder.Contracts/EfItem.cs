using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CVBuilder.Contracts
{
    public class EfItem<T> where T : DbItem
    {
        [Key]
        public string Id { get; set; } = string.Empty;

        [Column(TypeName = "jsonb")]
        public T Content { get; set; }
    }
}