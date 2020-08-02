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
           EmployeeID as "Employee Id",
           CONCAT(FirstName, ' ', LastName) AS "Employee Full Name",
           Title as "Title",
           City as "City"
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
            OrderID as "Order Id",
            SUM(UnitPrice * Quantity) as "Order Total Price",
            ROUND(SUM(Discount * Quantity)/SUM(UnitPrice * Quantity)*100,3) as "Total Order Discount, %"
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
            CustomerID as "CustomerId",
            CompanyName
        FROM Customers
        WHERE Country = "USA" AND Fax IS NULL
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
            CustomerID as "Customer Id",
            COUNT(*) as "Total number of Orders",
            ROUND(COUNT(*) * 100 / (SELECT 
                COUNT(*) 
                FROM Orders
            ), 5) as "% of all orders" 
        FROM Orders
        GROUP BY CustomerID
        ORDER BY COUNT(*) DESC, CustomerID ASC
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
            ProductID as "ProductId",
            ProductName,
            QuantityPerUnit
        FROM Products
        WHERE ProductName REGEXP '^[A-F]'
        ORDER BY ProductName
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
            Products.ProductName,
            Categories.CategoryName,
            Suppliers.CompanyName as SupplierCompanyName
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
            DISTINCT Employees.EmployeeID as EmployeeId,
            CONCAT(Employees.FirstName," ",Employees.LastName) as FullName,
            IF(Employees.ReportsTo IS NULL, "-", Seniors.FullName) as ReportsTo
        FROM Employees,(
            SELECT
                EmployeeID,
                CONCAT(FirstName," ",LastName) as FullName
            FROM Employees
        ) as Seniors
        WHERE Employees.ReportsTo = Seniors.EmployeeID OR Employees.ReportsTo IS NULL
        ORDER BY EmployeeID
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
            Categories.CategoryName,
            COUNT(*) as TotalNumberOfProducts
        FROM Categories
        JOIN Products ON Categories.CategoryID = Products.CategoryID
        GROUP BY Categories.CategoryName
        ORDER BY Categories.CategoryName
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
            CustomerID,
            ContactName
        FROM Customers
        WHERE ContactName LIKE "F__n%"
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
            ProductID,
            ProductName
        FROM Products
        WHERE Products.Discontinued = 1
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
            CAST(UnitPrice AS UNSIGNED) as UnitPrice
        FROM Products
        WHERE UnitPrice BETWEEN 5 AND 15
        ORDER BY UnitPrice, ProductName
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
        SELECT
            ProductName,
            UnitPrice
        FROM(
            SELECT
                ProductName,
                UnitPrice
            FROM Products
            ORDER BY UnitPrice DESC
            LIMIT 20
        ) as Products
        ORDER BY UnitPrice, ProductName
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
            COUNT(*) as TotalOfCurrentProducts,
            SUM(Discontinued) as TotalOfDiscontinuedProducts
        FROM Products
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
            ProductName,
            UnitsOnOrder,
            UnitsInStock
        FROM Products
        WHERE UnitsOnOrder > UnitsInStock
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
            SUM(IF(OrderDate LIKE "1997-01%", 1, 0)) as January,
            SUM(IF(OrderDate LIKE "1997-02%", 1, 0)) as February,
            SUM(IF(OrderDate LIKE "1997-03%", 1, 0)) as March,
            SUM(IF(OrderDate LIKE "1997-04%", 1, 0)) as April,
            SUM(IF(OrderDate LIKE "1997-05%", 1, 0)) as May,
            SUM(IF(OrderDate LIKE "1997-06%", 1, 0)) as June,
            SUM(IF(OrderDate LIKE "1997-07%", 1, 0)) as July,
            SUM(IF(OrderDate LIKE "1997-08%", 1, 0)) as August,
            SUM(IF(OrderDate LIKE "1997-09%", 1, 0)) as September,
            SUM(IF(OrderDate LIKE "1997-10%", 1, 0)) as October,
            SUM(IF(OrderDate LIKE "1997-11%", 1, 0)) as November,
            SUM(IF(OrderDate LIKE "1997-12%", 1, 0)) as December
        FROM Orders
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
            OrderID,
            CustomerID,
            ShipCountry
        FROM Orders
        WHERE ShipPostalCode IS NOT NULL
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
            Categories.CategoryName,
            AVG(Products.UnitPrice) as AvgPrice
        FROM Products
        JOIN Categories ON Products.CategoryID = Categories.CategoryID
        GROUP BY CategoryName
        ORDER BY AvgPrice DESC
    `);
    return result[0];
}

/**
 * Create a SQL query to calcualte total orders count by each day in 1998:
 * | OrderDate | Total Number of Orders |
 *
 * Order Date needs to be in the format '%Y-%m-%d %T'
 * @return {array}
 *
 */
async function task_1_18(db) {
    let result = await db.query(`
        SELECT
            SUBSTRING(OrderDate,1,19) as OrderDate,
            COUNT(*) as "Total Number of Orders"
        FROM Orders
        WHERE SUBSTRING(OrderDate,1,4) = "1998"
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
            Orders.CustomerID,
            Customers.CompanyName,
            CAST(SUM(OrderDetails.UnitPrice * OrderDetails.Quantity) AS UNSIGNED) as "TotalOrdersAmount, $"
        FROM Orders
        JOIN Customers ON Customers.CustomerID = Orders.CustomerID
        JOIN OrderDetails ON Orders.OrderID = OrderDetails.OrderID
        GROUP BY Orders.CustomerID
        HAVING SUM(OrderDetails.UnitPrice * OrderDetails.Quantity) > 10000
        ORDER BY SUM(OrderDetails.UnitPrice * OrderDetails.Quantity) DESC, Orders.CustomerID
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
            Employees.EmployeeID,
            CONCAT(FirstName, ' ', LastName) AS "Employee Full Name",
            SUM(OrderDetails.Quantity * OrderDetails.UnitPrice) as "Amount, $"
        FROM Employees
        JOIN Orders ON Employees.EmployeeID = Orders.EmployeeID
        JOIN OrderDetails ON Orders.OrderID = OrderDetails.OrderID
        GROUP BY EmployeeID
        ORDER BY SUM(OrderDetails.Quantity * OrderDetails.UnitPrice) DESC
        LIMIT 1 
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
            OrderID,
            SUM(UnitPrice * Quantity) as "Maximum Purchase Amount, $"
        FROM OrderDetails
        GROUP BY OrderID
        ORDER BY SUM(UnitPrice * Quantity) DESC
        LIMIT 1
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
        SELECT
            DISTINCT Info.CompanyName,
            Info.ProductName,
            Info.UnitPrice as PricePerItem
        FROM(
            SELECT
                CompanyName,
                ProductName,
                OrderDetails.UnitPrice
            FROM Customers
            JOIN Orders ON Customers.CustomerID = Orders.CustomerID
            JOIN OrderDetails ON Orders.OrderID = OrderDetails.OrderID
            JOIN Products ON OrderDetails.ProductID = Products.ProductID
        ) as Info
        WHERE Info.UnitPrice = (
            SELECT
                MAX(OrderDetails.UnitPrice)
            FROM Customers
            JOIN Orders ON Customers.CustomerID = Orders.CustomerID
            JOIN OrderDetails ON Orders.OrderID = OrderDetails.OrderID
            WHERE CompanyName = Info.CompanyName
        )
        ORDER BY PricePerItem DESC, CompanyName, ProductName
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
