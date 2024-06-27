import Plant from '../classes/PlantClass.js';

/**
 * 商品をクラス化する関数 (1つの商品)
 */
export function createClassifiedProduct(product) {
    let classifiedProduct = new Plant();
    classifiedProduct = Object.assign(classifiedProduct, product)

    return classifiedProduct;
}

/**
 * 商品をクラス化する関数 (Arrayごと)
 */
export function createClassifiedProducts(productsData) {
    let classifiedProducts = [];
    productsData.map((product, index) => {
        // 1つずつ商品をクラス化
        const classifiedProduct = createClassifiedProduct(product);
        classifiedProducts.push(classifiedProduct);
    });
    // クラス化した商品のArrayを返す
    return classifiedProducts;
}
