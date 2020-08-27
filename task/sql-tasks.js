'use strict';

/********************************************************************************************
 *                                                                                          *
 * The goal of the task is to get basic knowledge of SQL functions and                      *
 * approaches to work with data in SQL.                                                     *
 * https://dev.mysql.com/doc/refman/5.7/en/function-reference.html                          *
 *                                                                                          *
 * The course do not includes basic syntax explanations. If you see the SQL first time,     *
 * you can find explanation and some trainings at W3S                                       *
 * https://www.w3schools.com/sql/sql_syntax.asp                                             *
 *                                                                                          *
 ********************************************************************************************/


/**
 *  Create a SQL query to return next data ordered by city and then by name:
 * | Employy Id | Employee Full Name | Title | City |
 *
 * @return {array}
 *
 */
async function task_1_1(db) {
    // The first task is example, please follow the style in the next functions.
    let result = await db.query(`
        SELECT
           EmployeeID AS "Employee Id",
           CONCAT(FirstName, ' ', LastName) AS "Employee Full Name",
           Title AS "Title",
           City AS "City"
        FROM Employees
        ORDER BY City, "Employee Full Name"
    `);
    return result[0];
}

/**
 *  Create a query to return an Order list ordered by order id descending:
 * | Order Id | Order Total Price | Total Order Discount, % |
 *
 * NOTES: Discount in OrderDetails is a discount($) per Unit.
 * @return {array}
 *
 */
async function task_1_2(db) {
    let result = await db.query(`
    SELECT
	    OrderID AS "Order Id",
	    SUM(UnitPrice * Quantity) AS "Order Total Price",
	    ROUND( (SUM(Discount * Quantity)/SUM(UnitPrice * Quantity))*100,3) AS "Total Order Discount, %"
    FROM OrderDetails
    GROUP BY OrderID 
    ORDER BY OrderID DESC
    `);
    return result[0];
}

/**
 *  Create a query to return all customers from USA without Fax:
 * | CustomerId | CompanyName |
 *
 * @return {array}
 *
 */
async function task_1_3(db) {
    let result = await db.query(`
    SELECT
        CustomerId,
        CompanyName 
	FROM Customers
    WHERE Country = 'USA' AND Fax IS NULL 
    `);
    return result[0];
}

/**
 * Create a query to return:
 * | Customer Id | Total number of Orders | % of all orders |
 *
 * order data by % - higher percent at the top, then by CustomerID asc
 *
 * @return {array}
 *
 */
async function task_1_4(db) {
    let result = await db.query(`
    SELECT
	    CustomerId AS 'Customer Id',
	    COUNT(OrderID) AS 'Total number of Orders',
	    ROUND((SELECT COUNT(OrderID) FROM Orders WHERE CustomerID = o.CustomerID )*100/(SELECT COUNT(*) FROM Orders),5) AS '% of all orders'
    FROM Orders AS o
    GROUP BY CustomerID
    ORDER BY 3 DESC, CustomerId ASC
    `);
    return result[0];
}

/**
 * Return all products where product name starts with 'A', 'B', .... 'F' ordered by name.
 * | ProductId | ProductName | QuantityPerUnit |
 *
 * @return {array}
 *
 */
async function task_1_5(db) {
    let result = await db.query(`
    SELECT
	    ProductId AS 'ProductId',
	    ProductName ,
	    QuantityPerUnit 
    FROM Products
    WHERE ProductName >= 'A' AND ProductName <= 'G'
    ORDER BY ProductName ASC
    `);
    return result[0];
}

/**
 *
 * Create a query to return all products with category and supplier company names:
 * | ProductName | CategoryName | SupplierCompanyName |
 *
 * Order by ProductName then by SupplierCompanyName
 * @return {array}
 *
 */
async function task_1_6(db) {
    let result = await db.query(`
    SELECT
	    Products.ProductName ,
	    Categories.CategoryName ,
	    Suppliers.CompanyName AS 'SupplierCompanyName'
    FROM Products
    JOIN Categories ON Products.CategoryID = Categories.CategoryID 
    JOIN Suppliers ON Products.SupplierID = Suppliers.SupplierID 
    ORDER BY Products.ProductName, Suppliers.CompanyName
    `);
    return result[0];
}

/**
 *
 * Create a query to return all employees and full name of person to whom this employee reports to:
 * | EmployeeId | FullName | ReportsTo |
 *
 * Order data by EmployeeId.
 * Reports To - Full name. If the employee does not report to anybody leave "-" in the column.
 * @return {array}
 *
 */
async function task_1_7(db) {
    let result = await db.query(`
    SELECT
	    e1.EmployeeID AS "EmployeeId",
	    CONCAT(e1.FirstName, ' ', e1.LastName) AS "FullName",
	    IFNULL(CONCAT(e2.FirstName, ' ', e2.LastName),"-") AS "ReportsTo"
    FROM Employees e1 LEFT JOIN Employees e2 ON e1.ReportsTo = e2.EmployeeID 
    ORDER BY e1.EmployeeID 
    `);
    return result[0];
}

/**
 *
 * Create a query to return:
 * | CategoryName | TotalNumberOfProducts |
 *
 * @return {array}
 *
 */
async function task_1_8(db) {
    let result = await db.query(`
    SELECT
	    c.CategoryName,
	    COUNT(p.ProductName) AS 'TotalNumberOfProducts' 
    FROM Categories c LEFT JOIN Products p ON c.CategoryID = p.CategoryID 
    GROUP BY c.CategoryName
    `);
    return result[0];
}

/**
 *
 * Create a SQL query to find those customers whose contact name containing the 1st character is 'F' and the 4th character is 'n' and rests may be any character.
 * | CustomerID | ContactName |
 *
 * @return {array}
 *
 */
async function task_1_9(db) {
    let result = await db.query(`
    SELECT
	    CustomerID ,
	    ContactName 
    FROM Customers c 
    WHERE ContactName like 'F__n%'
    `);
    return result[0];
}

/**
 * Write a query to get discontinued Product list:
 * | ProductID | ProductName |
 *
 * @return {array}
 *
 */
async function task_1_10(db) {
    let result = await db.query(`
    SELECT
	    ProductID ,
	    ProductName 
    FROM Products p WHERE Discontinued != 0
    `);
    return result[0];
}

/**
 * Create a SQL query to get Product list (name, unit price) where products cost between $5 and $15:
 * | ProductName | UnitPrice |
 *
 * Order by UnitPrice then by ProductName
 *
 * @return {array}
 *
 */
async function task_1_11(db) {
    let result = await db.query(`
    SELECT
	    ProductName,
	    UnitPrice 
    FROM Products p WHERE UnitPrice BETWEEN 5 AND 15
    ORDER BY UnitPrice , ProductName 
    `);
    return result[0];
}

/**
 * Write a SQL query to get Product list of twenty most expensive products:
 * | ProductName | UnitPrice |
 *
 * Order products by price then by ProductName.
 *
 * @return {array}
 *
 */
async function task_1_12(db) {
    let result = await db.query(`
    SELECT * FROM (
        SELECT 
            ProductName,
            UnitPrice
        FROM Products ORDER BY UnitPrice DESC LIMIT 20) t
    ORDER BY UnitPrice, ProductName;
    `);
    return result[0];
}

/**
 * Create a SQL query to count current and discontinued products:
 * | TotalOfCurrentProducts | TotalOfDiscontinuedProducts |
 *
 * @return {array}
 *
 */
async function task_1_13(db) {
    let result = await db.query(`
    SELECT 
        (
        SELECT 
            COUNT(*)
        FROM Products WHERE Discontinued = 1
        ) AS TotalOfDiscontinuedProducts,
        (
            SELECT
                COUNT(*)
            FROM Products
        ) AS TotalOfCurrentProducts
    `);
    return result[0];
}

/**
 * Create a SQL query to get Product list of stock is less than the quantity on order:
 * | ProductName | UnitsOnOrder| UnitsInStock |
 *
 * @return {array}
 *
 */
async function task_1_14(db) {
    let result = await db.query(`
    SELECT 
	    ProductName ,
	    UnitsOnOrder AS 'UnitsOnOrder',
	    UnitsInStock 
    FROM Products WHERE UnitsInStock < UnitsOnOrder 
    `);
    return result[0];
}

/**
 * Create a SQL query to return the total number of orders for every month in 1997 year:
 * | January | February | March | April | May | June | July | August | September | November | December |
 *
 * @return {array}
 *
 */
async function task_1_15(db) {
    let result = await db.query(`
    SELECT
        COUNT (IF (MONTH (OrderDate) = 1, 1, null)) AS January,
        COUNT (IF (MONTH (OrderDate) = 2, 1, null)) AS February,
        COUNT (IF (MONTH (OrderDate) = 3, 1, null)) AS March,
        COUNT (IF (MONTH (OrderDate) = 4, 1, null)) AS April,
        COUNT (IF (MONTH (OrderDate) = 5, 1, null)) AS May,
        COUNT (IF (MONTH (OrderDate) = 6, 1, null)) AS June,
        COUNT (IF (MONTH (OrderDate) = 7, 1, null)) AS July,
        COUNT (IF (MONTH (OrderDate) = 8, 1, null)) AS August,
        COUNT (IF (MONTH (OrderDate) = 9, 1, null)) AS September,
        COUNT (IF (MONTH (OrderDate) = 10, 1, null)) AS October,
        COUNT (IF (MONTH (OrderDate) = 11, 1, null)) AS November,
        COUNT (IF (MONTH (OrderDate) = 12, 1, null)) AS December
    FROM
	    Orders
    WHERE
	    year(OrderDate) = 1997;
    `);
    return result[0];
}

/**
 * Create a SQL query to return all orders where ship postal code is provided:
 * | OrderID | CustomerID | ShipCountry |
 *
 * @return {array}
 *
 */
async function task_1_16(db) {
    let result = await db.query(`
    SELECT 
	    OrderID ,
	    CustomerID ,
	    ShipCountry 
    FROM Orders WHERE ShipPostalCode IS NOT NULL 
    `);
    return result[0];
}

/**
 * Create SQL query to display the average price of each categories's products:
 * | CategoryName | AvgPrice |
 *
 * @return {array}
 *
 * Order by AvgPrice descending then by CategoryName
 *
 */
async function task_1_17(db) {
    let result = await db.query(`
    SELECT 
	    CategoryName ,
	    round(avg(p.UnitPrice ),4)AS AvgPrice
    FROM Categories c JOIN Products p on c.CategoryID = p.CategoryID 
    GROUP BY c.CategoryID 
    ORDER BY AvgPrice DESC , CategoryName 
    `);
    return result[0];
}

/**
 * Create a SQL query to calcualte total orders count by each day in 1998:
 * | OrderDate | Total Number of Orders |
 *
 * OrderDate needs to be in the format '%Y-%m-%d %T'
 * @return {array}
 *
 */
async function task_1_18(db) {
    let result = await db.query(`
    SELECT 
        DATE_FORMAT(OrderDate, '%Y-%m-%d %T') AS 'OrderDate',
	    COUNT(OrderID ) AS "Total Number of Orders"
    FROM Orders WHERE OrderDate between '1998-01-01' AND '1999-01-01'
    GROUP BY OrderDate  
    `);
    return result[0];
}

/**
 * Create a SQL query to display customer details whose total orders amount is more than 10000$:
 * | CustomerID | CompanyName | TotalOrdersAmount, $ |
 *
 * Order by "TotalOrdersAmount, $" descending then by CustomerID
 * @return {array}
 *
 */
async function task_1_19(db) {
    let result = await db.query(`
    SELECT 
	    c.CustomerID ,
	    c.CompanyName ,
	    SUM(od.UnitPrice * od.Quantity ) AS "TotalOrdersAmount, $"
    FROM Customers c JOIN Orders o ON c.CustomerID = o.CustomerID JOIN OrderDetails od ON o.OrderID = od.OrderID
    GROUP BY c.CustomerID 
    HAVING SUM(od.UnitPrice * od.Quantity)>10000
    ORDER BY 3 DESC, c.CustomerID 
    `);
    return result[0];
}

/**
 *
 * Create a SQL query to find the employee that sold products for the largest amount:
 * | EmployeeID | Employee Full Name | Amount, $ |
 *
 * @return {array}
 *
 */
async function task_1_20(db) {
    let result = await db.query(`
    SELECT
	    e.EmployeeID ,
	    CONCAT(e.FirstName, ' ', e.LastName ) AS "Employee Full Name",
	    SUM(od.UnitPrice * od.Quantity ) AS "Amount, $"
    FROM Employees e JOIN Orders o ON e.EmployeeID = o.EmployeeID JOIN OrderDetails od ON o.OrderID = od.OrderID
    GROUP BY e.EmployeeID 
    ORDER BY 3 DESC LIMIT 1
    `);
    return result[0];
}

/**
 * Write a SQL statement to get the maximum purchase amount of all the orders.
 * | OrderID | Maximum Purchase Amount, $ |
 *
 * @return {array}
 */
async function task_1_21(db) {
    let result = await db.query(`
    SELECT
	    OrderID ,
	    SUM(UnitPrice * Quantity ) AS "Maximum Purchase Amount, $"
    FROM OrderDetails od
    GROUP BY OrderID 
    ORDER BY 2 DESC LIMIT 1
    `);
    return result[0];
}

/**
 * Create a SQL query to display the name of each customer along with their most expensive purchased product:
 * | CompanyName | ProductName | PricePerItem |
 *
 * order by PricePerItem descending and them by CompanyName and ProductName acceding
 * @return {array}
 */
async function task_1_22(db) {
    let result = await db.query(`
    SELECT distinct
        CompanyName, 
        ProductName, 
        PricePerItem
    FROM
        (
            SELECT 
            CompanyName,
            Customers.CustomerID,
            MAX(OrderDetails.UnitPrice) AS PricePerItem
        FROM
            Customers
        JOIN Orders ON Customers.CustomerID = Orders.CustomerID
        JOIN OrderDetails ON Orders.OrderID = OrderDetails.OrderID
        GROUP BY CompanyName, CustomerID
        ) t
    INNER JOIN Orders ON t.CustomerID = Orders.CustomerID
    INNER JOIN OrderDetails ON PricePerItem = OrderDetails.UnitPrice AND Orders.OrderID = OrderDetails.OrderID
    INNER JOIN Products ON Products.ProductID = OrderDetails.ProductID
    ORDER BY PricePerItem DESC, CompanyName, ProductName; 
    `);
    return result[0];
}

module.exports = {
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
