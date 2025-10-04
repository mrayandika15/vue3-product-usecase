import type { ProductListResponse } from '@/types/product'

// Dummy data service that simulates API responses
export class ProductService {
  private static dummyData: ProductListResponse = {
    meta: {
      code: 200,
      status: "success",
      message: "Daftar barang."
    },
    data: {
      current_page: 1,
      data: [
        {
          id: 761,
          sku: "T1232",
          barcode: null,
          unit: "kg",
          name: "AAA",
          description: null,
          price: 271000,
          discount: 0,
          price_discount: 0,
          is_active: 1,
          has_variant: 0,
          as_addon: 0,
          variant_status: "INACTIVE",
          addon_status: "INACTIVE",
          image: null,
          total_sku: 1,
          status: "ACTIVE",
          available_data: null,
          created_by: "TakeHome",
          updated_at: "2025-10-04T11:12:03.000000Z",
          add_on_link_count: 1,
          category: {
            id: 164,
            name: "Buah-buahan",
            created_by: "TakeHome",
            updated_by: null
          },
          combines: [],
          variant_item: [],
          variant: []
        },
        {
          id: 744,
          sku: "zcs",
          barcode: null,
          unit: "asc",
          name: "asd",
          description: "cc",
          price: 1,
          discount: 0,
          price_discount: 0,
          is_active: 1,
          has_variant: 0,
          as_addon: 0,
          variant_status: "INACTIVE",
          addon_status: "INACTIVE",
          image: "business/products/items/17595636891229545.png",
          total_sku: 1,
          status: "ACTIVE",
          available_data: null,
          created_by: "TakeHome",
          updated_at: "2025-10-04T11:12:03.000000Z",
          add_on_link_count: 1,
          category: {
            id: 164,
            name: "Buah-buahan",
            created_by: "TakeHome",
            updated_by: null
          },
          combines: [],
          variant_item: [],
          variant: []
        },
        {
          id: 737,
          sku: "AG3136",
          barcode: null,
          unit: "kg",
          name: "Ayam",
          description: "Mantulita",
          price: 30000,
          discount: 0,
          price_discount: 0,
          is_active: 1,
          has_variant: 0,
          as_addon: 0,
          variant_status: "INACTIVE",
          addon_status: "INACTIVE",
          image: "business/products/items/17595700371035806.jpg",
          total_sku: 1,
          status: "ACTIVE",
          available_data: null,
          created_by: "TakeHome",
          updated_at: "2025-10-04T11:12:03.000000Z",
          add_on_link_count: 2,
          category: {
            id: 170,
            name: "Lauk Hewani",
            created_by: "TakeHome",
            updated_by: null
          },
          combines: [],
          variant_item: [],
          variant: []
        },
        {
          id: 659,
          sku: "MA001",
          barcode: null,
          unit: "porsi",
          name: "Ayam Bakar",
          description: "ayam montok",
          price: 25000,
          discount: 0,
          price_discount: 0,
          is_active: 1,
          has_variant: 0,
          as_addon: 0,
          variant_status: "INACTIVE",
          addon_status: "INACTIVE",
          image: "business/products/items/17594705731822310.jpg",
          total_sku: 1,
          status: "ACTIVE",
          available_data: null,
          created_by: "TakeHome",
          updated_at: "2025-10-04T11:12:03.000000Z",
          add_on_link_count: 0,
          category: {
            id: 165,
            name: "Dessert",
            created_by: "TakeHome",
            updated_by: null
          },
          combines: [],
          variant_item: [],
          variant: []
        },
        {
          id: 687,
          sku: "AG3135",
          barcode: null,
          unit: "kg",
          name: "Ayam Bakar cabe ijo",
          description: "Mantulita",
          price: 30000,
          discount: 0,
          price_discount: 0,
          is_active: 1,
          has_variant: 0,
          as_addon: 0,
          variant_status: "INACTIVE",
          addon_status: "INACTIVE",
          image: null,
          total_sku: 1,
          status: "ACTIVE",
          available_data: null,
          created_by: "TakeHome",
          updated_at: "2025-10-04T11:12:03.000000Z",
          add_on_link_count: 1,
          category: {
            id: 165,
            name: "Dessert",
            created_by: "TakeHome",
            updated_by: null
          },
          combines: [],
          variant_item: [],
          variant: []
        },
        {
          id: 623,
          sku: "BR001",
          barcode: null,
          unit: "pcs",
          name: "Burger Beef",
          description: "Burger daging sapi premium",
          price: 45000,
          discount: 5000,
          price_discount: 40000,
          is_active: 1,
          has_variant: 1,
          as_addon: 0,
          variant_status: "ACTIVE",
          addon_status: "INACTIVE",
          image: "business/products/items/burger-beef.jpg",
          total_sku: 3,
          status: "ACTIVE",
          available_data: null,
          created_by: "TakeHome",
          updated_at: "2025-10-04T10:30:15.000000Z",
          add_on_link_count: 3,
          category: {
            id: 168,
            name: "Fast Food",
            created_by: "TakeHome",
            updated_by: null
          },
          combines: [],
          variant_item: [],
          variant: []
        },
        {
          id: 598,
          sku: "ES001",
          barcode: "1234567890123",
          unit: "gelas",
          name: "Es Teh Manis",
          description: "Minuman segar es teh manis",
          price: 8000,
          discount: 0,
          price_discount: 0,
          is_active: 1,
          has_variant: 0,
          as_addon: 1,
          variant_status: "INACTIVE",
          addon_status: "ACTIVE",
          image: "business/products/items/es-teh-manis.jpg",
          total_sku: 1,
          status: "ACTIVE",
          available_data: null,
          created_by: "TakeHome",
          updated_at: "2025-10-04T09:45:22.000000Z",
          add_on_link_count: 0,
          category: {
            id: 172,
            name: "Minuman",
            created_by: "TakeHome",
            updated_by: null
          },
          combines: [],
          variant_item: [],
          variant: []
        },
        {
          id: 575,
          sku: "NAS001",
          barcode: null,
          unit: "porsi",
          name: "Nasi Gudeg",
          description: "Nasi gudeg khas Yogyakarta",
          price: 18000,
          discount: 2000,
          price_discount: 16000,
          is_active: 1,
          has_variant: 0,
          as_addon: 0,
          variant_status: "INACTIVE",
          addon_status: "INACTIVE",
          image: "business/products/items/nasi-gudeg.jpg",
          total_sku: 1,
          status: "ACTIVE",
          available_data: null,
          created_by: "TakeHome",
          updated_at: "2025-10-04T08:20:10.000000Z",
          add_on_link_count: 2,
          category: {
            id: 166,
            name: "Makanan Tradisional",
            created_by: "TakeHome",
            updated_by: null
          },
          combines: [],
          variant_item: [],
          variant: []
        }
      ],
      first_page_url: "http://localhost/api/products?page=1",
      from: 1,
      last_page: 3,
      last_page_url: "http://localhost/api/products?page=3",
      links: [],
      next_page_url: "http://localhost/api/products?page=2",
      path: "http://localhost/api/products",
      per_page: 10,
      prev_page_url: null,
      to: 8,
      total: 24
    }
  }

  // Simulate API call with delay
  static async getProducts(page: number = 1, perPage: number = 10): Promise<ProductListResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Return paginated data
    const startIndex = (page - 1) * perPage
    const endIndex = startIndex + perPage
    const paginatedData = this.dummyData.data.data.slice(startIndex, endIndex)
    
    return {
      ...this.dummyData,
      data: {
        ...this.dummyData.data,
        current_page: page,
        data: paginatedData,
        from: startIndex + 1,
        to: Math.min(endIndex, this.dummyData.data.data.length),
        per_page: perPage,
        last_page: Math.ceil(this.dummyData.data.data.length / perPage)
      }
    }
  }

  // Format price to Indonesian Rupiah
  static formatPrice(price: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  // Format date to Indonesian format
  static formatDate(dateString: string): string {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  // Get status badge color
  static getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success'
      case 'inactive':
        return 'error'
      default:
        return 'default'
    }
  }
}