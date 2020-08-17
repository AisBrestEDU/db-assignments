'use strict';

/********************************************************************************************
 *                                                                                          *
 * The goal of the task is to get basic knowledge of mongodb functions and                  *
 * approaches to work with data in mongodb. Most of the queries should be implemented with  *
 * aggregation pipelines.                                                                   *
 * https://docs.mongodb.com/manual/reference/aggregation/                                   *
 * https://docs.mongodb.com/manual/reference/operator/aggregation/                          *
 *                                                                                          *
 * The course do not includes basic syntax explanations                                     *
 * Start from scratch can be complex for the tasks, if it's the case, please check          *
 * "MongoDB University". The M001 course starts quite often so you can finish it to get     *
 * the basic understanding.                                                                 *
 * https://university.mongodb.com/courses/M001/about                                        *
 *                                                                                          *
 ********************************************************************************************/

/**
 * The function is to add indexes to optimize your queries.
 * Test timeout is increased to 15sec for the function.
 * */
async function before(db) {
    await db.collection('employees').ensureIndex({CustomerID: 1});
}

/**
 *  Create a query to return next data ordered by city and then by name:
 * | Employy Id | Employee Full Name | Title | City |
 *
 * NOTES: if City is null - show city as "Unspecified"
 */
async function task_1_1(db) {
    // The first task is example, please follow the style in the next functions.
    const result = await db.collection('employees').aggregate([
        {
            $project: {
                _id: 0,
                EmployeeID: 1,
                "Employee Full Name": {$concat: ["$FirstName", " ", "$LastName"]},
                Title: 1,
                City: {$ifNull: ['$City', "Unspecified"]}
            }
        },
        {$sort: {City: 1, "Employee Full Name": 1}}
    ]).toArray();
    return result;
}

/**
 *  Create a query to return an Order list ordered by order id descending:
 * | Order Id | Order Total Price | Total Order Discount, % |
 *
 * NOTES:
 *  - Discount in OrderDetails is a discount($) per Unit.
 *  - Round all values to MAX 3 decimal places
 */
async function task_1_2(db) {
    const result = await db.collection('order-details').aggregate([
        {$group:{
                _id: "$OrderID",
                "total": {$sum: {$multiply: ["$UnitPrice", "$Quantity"]}},
                "disc": {$sum: {$multiply: ["$Discount", "$Quantity"]}}
                }},
        {$project:{
            _id: 0,
            "Order Id": "$_id",
            "Order Total Price": {$round:["$total", 3]},
            "Total Order Discount, %": {$round:[{$multiply:[{$divide:["$disc", "$total"]} ,100]} ,3]}       }},
        {$sort:{"Order Id": -1}}    
        ]).toArray();
    return result;
}

/**
 *  Create a query to return all customers without Fax, order by CustomerID:
 * | CustomerID | CompanyName |
 *
 * HINT: check by string "NULL" values
 */
async function task_1_3(db) {
    const result = await db.collection('customers').aggregate([
        {$match:{"Fax": "NULL"}},
        {$project:{
            _id: 0,
            "CustomerID": "$CustomerID",
            "CompanyName": "$CompanyName"}}
    ]).toArray();
    return result;
}

/**
 * Create a query to return:
 * | Customer Id | Total number of Orders | % of all orders |
 *
 * Order data by % - higher percent at the top, then by CustomerID asc.
 * Round all values to MAX 3 decimal places.
 *
 * HINT: that can done in 2 queries to mongodb.
 *
 */
async function task_1_4(db) {
    const totalCount = await db.collection('orders').count();
    const result = await db.collection('orders').aggregate([
        {$group:{
            _id: "$CustomerID",
            "count": {$sum: 1}        }},
          {$project:{
              _id:0,
              "Customer Id": "$_id",
              "Total number of Orders": "$count",
              "% of all orders": {$round:[{$multiply:[{$divide:["$count", totalCount]},100]},3]}
              }},
          {$sort:{"% of all orders":-1,
              "Customer Id":1}}
      ]).toArray();
    return result;
}

/**
 * Return all products where product name starts with 'A', 'B', .... 'F' ordered by name.
 * | ProductID | ProductName | QuantityPerUnit |
 */
async function task_1_5(db) {
    const result = await db.collection('products').aggregate([
        {$match:{ProductName: {$lte: "G"}}},
         {$project:{
             _id: 0,
             "ProductID": "$ProductID",
             "ProductName": "$ProductName",
             "QuantityPerUnit": "$QuantityPerUnit"
             }
         },
         {$sort:{"ProductName": 1}}
      ]).toArray();
    return result;
}

/**
 *
 * Create a query to return all products with category and supplier company names:
 * | ProductName | CategoryName | SupplierCompanyName |
 *
 * Order by ProductName then by SupplierCompanyName
 *
 * HINT: see $lookup operator
 *       https://docs.mongodb.com/manual/reference/operator/aggregation/lookup/
 */
async function task_1_6(db) {
    const result = await db.collection('products').aggregate([
        {$lookup:{
            from:"categories",
            localField:"CategoryID",
            foreignField:"CategoryID",
            as:"Category"}},
        {$lookup:{
            from:"suppliers",
            localField:"SupplierID",
            foreignField:"SupplierID",
            as:"Supplier"}},
        {$project:{
            _id:0,
            "ProductName": "$ProductName",
            "CategoryName": {$reduce:{
                input:"$Category.CategoryName",
                initialValue: 0,
                in:"$$this"
                }},
            "SupplierCompanyName": {$reduce:{
                input:"$Supplier.CompanyName",
                initialValue:0,
                in: "$$this"
                }}}},
        {$sort:{"ProductName":1,"SupplierCompanyName":1}}
        ]).toArray();
    return result;
}

/**
 *
 * Create a query to return all employees and full name of person to whom this employee reports to:
 * | EmployeeID | FullName | ReportsTo |
 *
 * Full Name - title of courtesy with full name.
 * Order data by EmployeeID.
 * Reports To - Full name. If the employee does not report to anybody leave "-" in the column.
 */
async function task_1_7(db) {
    const result = await db.collection('employees').aggregate([
        {$lookup:{
            from:"employees",
            localField:"ReportsTo",
            foreignField:"EmployeeID",
            as:"Reports"}},
        {$project:{
            _id:0,
            "EmployeeID":"$EmployeeID",
            "FullName": {$concat:["$TitleOfCourtesy", "$FirstName", " ", "$LastName"]},
            "ReportsTo": {$ifNull:[
                {$concat:[{$reduce:{
                    input:"$Reports.FirstName",
                    initialValue:null,
                    in:"$$this"}}," ",
                    {$reduce:{
                    input:"$Reports.LastName",
                    initialValue:null,
                    in:"$$this"}}]}
                , '-']}
            }},
            {$sort:{"EmployeeID":1}}
        ]).toArray();
    return result;
}

/**
 *
 * Create a query to return:
 * | CategoryName | TotalNumberOfProducts |
 * Order by CategoryName
 */
async function task_1_8(db) {
    const result = await db.collection('products').aggregate([
        {$lookup:{
            from:"categories",
            localField:"CategoryID",
            foreignField:"CategoryID",
            as:"Category"}},
        {$group:{
            _id:{$reduce:{
                input:"$Category.CategoryName",
                initialValue:"",
                in:"$$this"}},
            "count":{$sum:1}}},
        {$project:{
            _id:0,
            "CategoryName":"$_id",
            "TotalNumberOfProducts":"$count"
            }},
            {$sort:{"CategoryName":1}}
        ]).toArray();
    return result;
}

/**
 *
 * Create a query to find those customers whose contact name containing the 1st character is 'F' and the 4th character is 'n' and rests may be any character.
 * | CustomerID | ContactName |
 * order by CustomerID
 */
async function task_1_9(db) {
    
    const result = await db.collection('customers').aggregate([
        {$match:{
            ContactName:{$regex:'^F..n'}}},
        {$project:{
            _id:0,
            "CustomerID":"$CustomerID",
            "ContactName":"$ContactName"}},
        {$sort:{"CustomerID":1}}
        ]).toArray();
    return result;
}

/**
 * Write a query to get discontinued Product list:
 * | ProductID | ProductName |
 * order by ProductID
 */
async function task_1_10(db) {
    const result = await db.collection('products').aggregate([
        {$match:{Discontinued: {$gt:0}}},
        {$project:{
            _id:0,
            "ProductID":"$ProductID",
            "ProductName":"$ProductName"}},
        {$sort:{"ProductID":1}}
        ]).toArray();
        return result;
}

/**
 * Create a query to get Product list (name, unit price) where products cost between $5 and $15:
 * | ProductName | UnitPrice |
 *
 * Order by UnitPrice then by ProductName
 */
async function task_1_11(db) {
    const result = await db.collection('products').aggregate([
        {$match:{UnitPrice:{
            $gte:5,
            $lte:15}}},
        {$project:{
            _id:0,
            "ProductName":"$ProductName",
            "UnitPrice":"$UnitPrice"
            }},
        {$sort:{"UnitPrice":1,"ProductName":1}}
        ]).toArray();
        return result;
}

/**
 * Write a SQL query to get Product list of twenty most expensive products:
 * | ProductName | UnitPrice |
 *
 * Order products by price (asc) then by ProductName.
 */
async function task_1_12(db) {
    const result = await db.collection('products').aggregate([        
    {$project:{
        _id:0,
        "ProductName":"$ProductName",
        "UnitPrice":"$UnitPrice"
        }},
    {$sort:{"UnitPrice":-1}},
    {$limit:20},
    {$sort:{"UnitPrice":1,"ProductName":1}}
    ]).toArray();
    return result;
}

/**
 * Create a query to count current and discontinued products:
 * | TotalOfCurrentProducts | TotalOfDiscontinuedProducts |
 *
 * HINT: That's acceptable to make it in 2 queries
 */
async function task_1_13(db) {
    const result = {
        "TotalOfCurrentProducts": await db.collection('products').count(),
        "TotalOfDiscontinuedProducts": await db.collection('products').count({Discontinued:1})
    }
        return result;
}

/**
 * Create a query to get Product list of stock is less than the quantity on order:
 * | ProductName | UnitsOnOrder| UnitsInStock |
 * Order by ProductName
 *
 * HINT: see $expr operator
 *       https://docs.mongodb.com/manual/reference/operator/query/expr/#op._S_expr
 */
async function task_1_14(db) {
    const result = await db.collection('products').aggregate([        
    {$match:{$expr:{$lt:["$UnitsInStock","$UnitsOnOrder"]}}},
    {$project:{
        _id:0,
        "ProductName":"$ProductName",
        "UnitsOnOrder":"$UnitsOnOrder",
        "UnitsInStock":"$UnitsInStock"
        }},
    {$sort:{"ProductName":1}}
        ]).toArray();
        return result;
}

/**
 * Create a query to return the total number of orders for every month in 1997 year:
 * | January | February | March | April | May | June | July | August | September | November | December |
 *
 * HINT: see $dateFromString
 *       https://docs.mongodb.com/manual/reference/operator/aggregation/dateFromString/
 */
async function task_1_15(db) {
    const result = await db.collection('orders').aggregate([
        {$project:{
            "year":{$year:{$toDate:"$OrderDate"}},
            "month":{$month:{$toDate:"$OrderDate"}} }},
        {$match:{
            $expr:{$eq:["$year",1997]}}},
        {$group:{    
            _id:null,
            "January":{$sum:{$cond:[{$eq:["$month",1]},1,null]}},
            "Febuary":{$sum:{$cond:[{$eq:["$month",2]},1,null]}},
            "March":{$sum:{$cond:[{$eq:["$month",3]},1,null]}},
            "April":{$sum:{$cond:[{$eq:["$month",4]},1,null]}},
            "May":{$sum:{$cond:[{$eq:["$month",5]},1,null]}},
            "June":{$sum:{$cond:[{$eq:["$month",6]},1,null]}},
            "July":{$sum:{$cond:[{$eq:["$month",7]},1,null]}},
            "August":{$sum:{$cond:[{$eq:["$month",8]},1,null]}},
            "September":{$sum:{$cond:[{$eq:["$month",9]},1,null]}},
            "October":{$sum:{$cond:[{$eq:["$month",10]},1,null]}},
            "November":{$sum:{$cond:[{$eq:["$month",11]},1,null]}},
            "December":{$sum:{$cond:[{$eq:["$month",12]},1,null]}}}},
        {$project:{
            _id:0,
            "January":"$January",
            "February":"$Febuary",
            "March":"$March",
            "April":"$April",
            "May":"$May",
            "June":"$June",
            "July":"$July",
            "August":"$August",
            "September":"$September",
            "October":"$October",
            "November":"$November",
            "December":"$December"
            }}
        ]).toArray();
            return result[0];
}

/**
 * Create a query to return all orders where ship postal code is provided:
 * | OrderID | CustomerID | ShipCountry |
 * Order by OrderID
 */
async function task_1_16(db) {
    
    const result = await db.collection('orders').aggregate([        
        {$match:{
            ShipPostalCode: { $ne: null } }},
        {$project:{
            _id:0,
            "OrderID":"$OrderID",
            "CustomerID":"$CustomerID",
            "ShipCountry":"$ShipCountry",
            }},
            {$sort:{"OrderID":1}}
            ]).toArray();
            return result;
}

/**
 * Create SQL query to display the average price of each categories's products:
 * | CategoryName | AvgPrice |
 * Order by AvgPrice descending then by CategoryName
 * NOTES:
 *  - Round AvgPrice to MAX 2 decimal places
 */
async function task_1_17(db) {
    const result = await db.collection('products').aggregate([        
        {$lookup:{
            from:"categories",
            localField:"CategoryID",
            foreignField:"CategoryID",
            as:"Category"}},
        {$project:{
            "CategoryName":{$reduce:{
                input:"$Category.CategoryName",
                initialValue:"",
                in:"$$this"}},
            "Price":"$UnitPrice"}},
        {$group:{
            _id:"$CategoryName",
            "AvgPrice":{$avg:"$Price"}
            }},
        {$project:{
            _id:0,
            "CategoryName":"$_id",
            "AvgPrice":{$round:["$AvgPrice",2]}
            }},
        {$sort:{"AvgPrice":-1,"CategoryName":1}}
            ]).toArray();
            return result;
}

/**
 * Create a query to calcualte total orders count by each day in 1998:
 * | Order Date | Total Number of Orders |
 *
 * Order Date needs to be in the format '%Y-%m-%d'
 * Order by Order Date
 *
 * HINT: see $dateFromString, $dateToString
 *       https://docs.mongodb.com/manual/reference/operator/aggregation/dateToString/
 *       https://docs.mongodb.com/manual/reference/operator/aggregation/dateFromString/
 */
async function task_1_18(db) {
    const result = await db.collection('orders').aggregate([        
        {$match:{
            $expr:{$eq:[{$year:{$toDate:"$OrderDate"}},1998]}}},
        {$project:{
            "OrderDate":{$dateToString:{date:{$toDate:"$OrderDate"},format:"%Y-%m-%d"}},
            }},
        {$group:{
            _id:"$OrderDate",
            "count":{$sum:1}}},
        {$project:{
            _id:0,
            "Order Date":"$_id",
            "Total Number of Orders":"$count"}},
        {$sort:{"Order Date":1}}
            ]).toArray();
            return result;
}

/**
 * Create a query to display customer details whose total orders amount is more than 10000$:
 * | CustomerID | CompanyName | TotalOrdersAmount, $ |
 *
 * Order by "TotalOrdersAmount, $" descending then by CustomerID
 *  NOTES:
 *  - Round TotalOrdersAmount to MAX 2 decimal places
 *
 *  HINT: the query can be slow, you need to optimize it and pass in 2 seconds
 *       - https://docs.mongodb.com/manual/tutorial/analyze-query-plan/
 *       - quite often you can solve performance issues just with adding PROJECTIONS.
 *         *** Use Projections to Return Only Necessary Data ***
 *         https://docs.mongodb.com/manual/tutorial/optimize-query-performance-with-indexes-and-projections/#use-projections-to-return-only-necessary-data
 *       - do not hesitate to "ensureIndex" in "before" function at the top if needed https://docs.mongodb.com/manual/reference/method/db.collection.ensureIndex/
 */
async function task_1_19(db) {
    const result = await db.collection('order-details').aggregate([
        {$lookup:{
            from:"orders",
            localField:"OrderID",
            foreignField:"OrderID",
            as:"Order"}},
        {$lookup:{
            from:"customers",
            localField:"Order.CustomerID",
            foreignField:"CustomerID",
            as:"Customer"}},
        {$project:{
            "CustomerID":{$reduce:{
                input:"$Order.CustomerID",
                initialValue:-1,
                in:"$$this"}},
            "CompanyName":{$reduce:{
                input:"$Customer.CompanyName",
                initialValue:"",
                in:"$$this"}},
            "TotalOrdersAmount, $":{$multiply:["$UnitPrice","$Quantity"]}}},
        {$group:{
            _id:{
                "CustomerID":"$CustomerID",
                "CompanyName":"$CompanyName"},
            "Total":{$sum:"$TotalOrdersAmount, $"}}},
        {$match:{Total:{$gt:10000}}},
        {$project:{
            _id:0,
            "CustomerID":"$_id.CustomerID",
            "CompanyName":"$_id.CompanyName",
            "TotalOrdersAmount, $":{$round:["$Total",2]}
            }},
        {$sort:{"TotalOrdersAmount, $":-1,"CustomerID":1}}
        ]).toArray();
        return result;
}

/**
 *
 * Create a query to find the employee that sold products for the largest amount:
 * | EmployeeID | Employee Full Name | Amount, $ |
 */
async function task_1_20(db) {
    
    const result = await db.collection('order-details').aggregate([
        {$lookup:{
            from:"orders",
            localField:"OrderID",
            foreignField:"OrderID",
            as:"Order"}},
        {$lookup:{
            from:"employees",
            localField:"Order.EmployeeID",
            foreignField:"EmployeeID",
            as:"Empl"}},
        {$project:{
            "EmployeeID":{$reduce:{
                input:"$Empl.EmployeeID",
                initialValue:"",
                in:"$$this"}},
            "Employee Full Name":{$concat:[
                {$reduce:{
                input:"$Empl.FirstName",
                initialValue:"",
                in:"$$this"}}, " ", 
                {$reduce:{
                input:"$Empl.LastName",
                initialValue:"",
                in:"$$this"}}]},   
            "sum":{$multiply:["$UnitPrice","$Quantity"]}}},
        {$group:{
            _id:{
                "EmployeeID":"$EmployeeID",
                "Employee Full Name":"$Employee Full Name"
                },
            "Amount, $":{$sum:"$sum"}}},
        {$project:{
            _id:0,
            "EmployeeID":"$_id.EmployeeID",
            "Employee Full Name":"$_id.Employee Full Name",
            "Amount, $":"$Amount, $"
            }},
        {$sort:{"Amount, $":-1,"EmployeeID":1}},
        {$limit:1}
        ]).toArray();
        return result;
}

/**
 * Write a SQL statement to get the maximum purchase amount of all the orders.
 * | OrderID | Maximum Purchase Amount, $ |
 */
async function task_1_21(db) {
    
    const result = await db.collection('order-details').aggregate([
        {$project:{
            "OrderID":"$OrderID",
            "total":{$multiply:["$UnitPrice","$Quantity"]}}},
        {$group:{
            _id:"$OrderID",
            "Maximum Purchase Amount, $":{$sum:"$total"}}},
        {$project:{
            _id:0,
            "OrderID":"$_id",
            "Maximum Purchase Amount, $":"$Maximum Purchase Amount, $"}},
        {$sort:{"Maximum Purchase Amount, $":-1}},
        {$limit:1}
        ]).toArray();
        return result;
}

/**
 * Create a query to display the name of each customer along with their most expensive purchased product:
 * CustomerID | CompanyName | ProductName | PricePerItem |
 *
 * order by PricePerItem descending and them by CompanyName and ProductName acceding
 *
 * HINT: you can use pipeline inside of #lookup
 *       https://docs.mongodb.com/manual/reference/operator/aggregation/lookup/#join-conditions-and-uncorrelated-sub-queries
 */
async function task_1_22(db) {
    const result = await db.collection('orders').aggregate([
        {$lookup:{
            from:"order-details",
            localField:"OrderID",
            foreignField:"OrderID",
            as:"OD"}},
        {$unwind:"$OD"},
        {$sort:{"OD.UnitPrice":-1}},
        {$group:{
            _id:"$CustomerID",
            "ProductID":{$first:"$OD.ProductID"},
            "UnitPrice":{$first:"$OD.UnitPrice"}}},
        {$lookup:{
            from:"customers",
            localField:"_id",
            foreignField:"CustomerID",
            as:"C"}},
        {$lookup:{
            from:"products",
            localField:"ProductID",
            foreignField:"ProductID",
            as:"P"}},
        {$project:{
            _id:0,
            "CustomerID":"$_id",
            "CompanyName":{$reduce:{
                input:"$C.CompanyName",
                initialValue:"",
                in:"$$this"}},
            "ProductName":{$reduce:{
                input:"$P.ProductName",
                initialValue:"",
                in:"$$this"}},
            "PricePerItem":"$UnitPrice"}},
        {$sort:{"PricePerItem":-1,"CompanyName":1,"ProductName":1}}
    ]).toArray();
    return result;
}

module.exports = {
    before: before,
    task_1_1: task_1_1,
    task_1_2: task_1_2,
    task_1_3: task_1_3,
    task_1_4: task_1_4,
    task_1_5: task_1_5,
    task_1_6: task_1_6,
    task_1_7: task_1_7,
    task_1_8: task_1_8,
    task_1_9: task_1_9,
    task_1_10: task_1_10,
    task_1_11: task_1_11,
    task_1_12: task_1_12,
    task_1_13: task_1_13,
    task_1_14: task_1_14,
    task_1_15: task_1_15,
    task_1_16: task_1_16,
    task_1_17: task_1_17,
    task_1_18: task_1_18,
    task_1_19: task_1_19,
    task_1_20: task_1_20,
    task_1_21: task_1_21,
    task_1_22: task_1_22
};
