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
            SUM(Quantity * UnitPrice) as "Order Total Price",
            ROUND(
              SUM(Quantity * Discount * 100) / SUM(Quantity * UnitPrice),
              3
            ) as "Total Order Discount, %"
        FROM
          OrderDetails
        GROUP BY
          OrderId
        ORDER BY
          OrderID DESC
    `)
    return result[0]
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
          CustomerID as CustomerId,
          CompanyName
         FROM
          Customers
        WHERE
          Fax is NULL AND Country = 'USA'
    `)
    return result[0]
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
           CustomerID AS 'Customer Id',
           count(DISTINCT OrderID) AS 'Total number of Orders',
           ROUND(count(distinct OrderID) / (
               SELECT
                   count(distinct OrderID)
               FROM
                   OrderDetails
           ) * 100, 5) AS '% of all orders'
       FROM
           Orders
       GROUP BY
           CustomerID
       ORDER BY
           3 DESC,
           CustomerID ASC
   `) 
   return result[0]
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
            DISTINCT ProductID AS ProductId,
            ProductName,
            QuantityPerUnit
        FROM
            OrderDetails
            JOIN Products USING(ProductID)
        WHERE
            ProductName REGEXP '^[A-F]'
        ORDER BY 
            ProductName
    `)
    return result[0]
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
            ProductName,
            CategoryName,
            CompanyName AS SupplierCompanyName
        FROM
            Products
            JOIN Suppliers USING(SupplierID)
            JOIN Categories USING(CategoryID)
        ORDER BY
            ProductName,
            SupplierCompanyName
    `)
    return result[0]
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
            DISTINCT A.EmployeeID AS EmployeeId,
            CONCAT(A.FirstName, ' ', A.LastName) AS FullName,
            IF(
                A.ReportsTo IS NULL,
                '-',
                CONCAT(B.FirstName, ' ', B.LastName)
            ) AS ReportsTo
        FROM
            Employees A
            JOIN Employees B ON A.ReportsTo = B.EmployeeID
            OR A.ReportsTo IS NULL
        ORDER BY
            EmployeeId 
    `)
    return result[0]
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
            CategoryName as CategoryName,
            count(ProductName) AS TotalNumberOfProducts
        FROM
            Categories
            JOIN Products USING(CategoryID)
        GROUP BY
            CategoryName
        ORDER BY
            CategoryName
    `)
    return result[0]
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
            DISTINCT CustomerID,
            ContactName
        FROM
            Orders
            JOIN Customers USING(CustomerID)
        WHERE
            ContactName LIKE 'f__n%'
    `)
    return result[0]
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
        FROM
            Products
        WHERE
            Discontinued
    `)
    return result[0]
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
        FROM
            Products
        WHERE
            UnitPrice BETWEEN 5 AND 15
        ORDER BY
            UnitPrice,
            ProductName    
    `)
    return result[0]
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
            *
        FROM
            (
                SELECT
                    ProductName,
                    UnitPrice
                FROM
                    Products
                ORDER BY
                    UnitPrice DESC
                LIMIT
                    20
            ) Top20
        ORDER BY
            UnitPrice,
            ProductName
    `)
    return result[0]
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
            count(ProductID) AS TotalOfCurrentProducts,
            (
                SELECT
                    count(ProductID)
                FROM
                    Products
                WHERE
                    Discontinued
            ) AS TotalOfDiscontinuedProducts
        FROM
            Products
    `)
    return result[0]
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
        FROM
          Products
        WHERE 
            UnitsInStock < UnitsOnOrder
    `)
    return result[0]
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
            COUNT(IF(MONTHNAME(OrderDate) = 'January', 1, NULL)) AS January,
            COUNT(IF(MONTHNAME(OrderDate) = 'February', 1, NULL)) AS February,
            COUNT(IF(MONTHNAME(OrderDate) = 'March', 1, NULL)) AS March,
            COUNT(IF(MONTHNAME(OrderDate) = 'April', 1, NULL)) AS April,
            COUNT(IF(MONTHNAME(OrderDate) = 'May', 1, NULL)) AS May,
            COUNT(IF(MONTHNAME(OrderDate) = 'June', 1, NULL)) AS June,
            COUNT(IF(MONTHNAME(OrderDate) = 'July', 1, NULL)) AS July,
            COUNT(IF(MONTHNAME(OrderDate) = 'August', 1, NULL)) AS August,
            COUNT(IF(MONTHNAME(OrderDate) = 'September', 1, NULL)) AS September,
            COUNT(IF(MONTHNAME(OrderDate) = 'October', 1, NULL)) AS October,
            COUNT(IF(MONTHNAME(OrderDate) = 'November', 1, NULL)) AS November,
            COUNT(IF(MONTHNAME(OrderDate) = 'December', 1, NULL)) AS December
        FROM
            Orders
        WHERE
            YEAR(OrderDate) = 1997
    `)
    return result[0]
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
        FROM
            Orders
        WHERE
            NOT ISNULL(ShipPostalCode)
    `)
    return result[0]
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
            CategoryName,
            AVG(UnitPrice) AS AvgPrice
        FROM
            Products
            JOIN Categories USING(CategoryID)
        GROUP BY
            CategoryName
        ORDER BY
            AvgPrice DESC,
            CategoryName
    `)
    return result[0]
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
            CONVERT(OrderDate, CHAR) AS OrderDate,
            count(OrderID) AS 'Total Number of Orders'
        FROM
            Orders
        WHERE
            YEAR(OrderDate) = 1998
        GROUP BY
            OrderDate
    `)
    return result[0]
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
            sum(UnitPrice * Quantity) AS 'TotalOrdersAmount, $',
            CustomerID,
            CompanyName
        FROM
            Orders
            JOIN Customers USING(CustomerID)
            JOIN OrderDetails USING(OrderID)
        GROUP BY
            CustomerID
        HAVING
            sum(UnitPrice * Quantity) > 10000
        ORDER BY
            1 DESC,
            CustomerID
    `)
    return result[0]
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
            EmployeeID,
            CONCAT(FirstName, ' ', LastName) AS 'Employee Full Name',
            SUM(UnitPrice * Quantity) AS 'Amount, $'
        FROM
            Orders
            JOIN Employees USING(EmployeeID)
            JOIN OrderDetails USING(OrderID)
        GROUP BY
            EmployeeID
        ORDER BY
            3 DESC
        LIMIT
            1
    `)
    return result[0]
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
            sum(UnitPrice * Quantity) as  'Maximum Purchase Amount, $'
        FROM
            OrderDetails
        GROUP BY
            OrderID
        ORDER BY
            2 DESC
        Limit 1
    `)
    return result[0]
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
            DISTINCT CompanyName,
            ProductName,
            OrderDetails.UnitPrice AS PricePerItem
        FROM
            Orders
            JOIN Customers USING(CustomerID)
            JOIN OrderDetails USING(OrderID)
            JOIN Products USING(ProductID)
        WHERE
            OrderDetails.UnitPrice = (
                SELECT
                    max(UnitPrice)
                FROM
                    OrderDetails
                    JOIN Orders USING(OrderID)
                    JOIN Customers _Customers USING(CustomerID)
                WHERE
                    Customers.CompanyName = _Customers.CompanyName
            )
        ORDER BY
            PricePerItem DESC,
            CompanyName,
            ProductName
    `)
    return result[0]
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
