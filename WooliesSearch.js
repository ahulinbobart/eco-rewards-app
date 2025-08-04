
export function getProductQuery (Query) {
    //URL for the woolies API
    const url = 'https://www.woolworths.com.au/apis/ui/Search/products/?searchTerm=' + encodeURIComponent(Query);
    return new Promise((resolve, reject) => {
    //Send a GET header to the API
    const result = fetch(url, {
        method: 'GET',

        headers: {
            'GET': '/apis/ui/Search/products/?searchterm=' + encodeURIComponent(Query) ,
            'Scheme':'https',
            'Host': 'www.woolworths.com.au',
            'Filename': '/apis/ui/Search/products',
            'searchterm': Query

        },


    //wait for response, then convert to json and process into Product objects
    }).then(res => res.json()).then(data => {
        resolve({
            //Map each non-null ProductData entry to a new Product object
            products: data.Products.filter(item => item.Products ? item.Products[0] : false).map(item => new Product(item.Products.[0])),
        });
    }).catch(reject);
    });
}

export class Product {
    constructor(ProductData) {
        this.name = ProductData.Name;
        this.description = ProductData.Description;
        this.productCode = ProductData.Stockcode;
        this.price = ProductData.Price;
        //Large thumbnails better for display on productinfo page on high resolution phones
        //this.thumbnail = ProductData.SmallImageFile;
        this.thumbnail = ProductData.LargeImageFile;
        this.packageSize = ProductData.PackageSize;
        this.ratings = ProductData.Rating.Average.toFixed(2);
        this.onSpecial = ProductData.IsOnSpecial;
        this.inStock = ProductData.IsInStock;
        this.brand = ProductData.Brand;
        this.category = ProductData.AdditionalAttributes.sapcategoryname;
        //subCategory will be used to determine green rating data
        this.subCategory = ProductData.AdditionalAttributes.sapsubcategoryname;
        this.longDescription = ProductData.AdditionalAttributes.description;
        this.country = ProductData.AdditionalAttributes.countryoforigin;
    }
}
