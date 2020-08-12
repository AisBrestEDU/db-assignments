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
    debugger;
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
    debugger;
    let result = await db.query(`
    SELECT 
        OrderID as "Order Id",
        sum(UnitPrice * Quantity) as "Order Total Price",
        ROUND(SUM(Discount * Quantity)/SUM(UnitPrice * Quantity) * 100,3) as "Total Order Discount, %"    
    FROM OrderDetails
    group by OrderID
    order by OrderID desc
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
    debugger;
    let result = await db.query(`
    select
        CustomerID as "CustomerId",
        CompanyName as "CompanyName"
    from Customers
    where Country = "USA" and Fax is null;
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
    debugger;
    let result = await db.query(`
    SELECT 
        CustomerID as "Customer Id",
        count(CustomerID) as "Total number of Orders",
        round(count(*) / sum(count(*)) over() * 100, 5) as "% of all orders"    
    FROM Orders
    group by CustomerID
    order by 3 desc, CustomerID asc
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
    select
        ProductID as "ProductId",
        ProductName as "ProductName",
        QuantityPerUnit as "QuantityPerUnit"
from Products
	where ProductName between "A" and "G"
    order by ProductName
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
    select 
        ProductName as "ProductName",
        CategoryName as "CategoryName",
        CompanyName as "SupplierCompanyName"
    from Products 
       join Categories on Products.CategoryID = Categories.CategoryID
       join Suppliers on Products.SupplierID = Suppliers.SupplierID
    order by 1, 3
    
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
    select 
        e2.EmployeeId as "EmployeeId",
        concat( e2.FirstName, " ", e2.LastName) as "FullName",
        coalesce(concat( e1.FirstName, " ", e1.LastName), '-') as "ReportsTo"
    from 
       Employees e1
           right join Employees e2 on e1.EmployeeID = e2.ReportsTo
       order by e2.EmployeeID
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
select 
	c.CategoryName,
    count(p.CategoryID) as "TotalNumberOfProducts"
from Products p join Categories c
	on p.CategoryID = c.CategoryID
    group by c.CategoryName
    order by 1
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
 where ContactName like 'F%___n%'
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
        where Discontinued > 0
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
    FROM Products
	    where UnitPrice between 5 and 15
        order by UnitPrice, ProductName
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
 FROM (select * from Products order by UnitPrice desc limit 20) T
    order by UnitPrice asc, ProductName asc
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
	count(ProductName) as "TotalOfCurrentProducts",
	sum(Discontinued) as "TotalOfDiscontinuedProducts"
 FROM Products;
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
	where UnitsInStock < UnitsOnOrder
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
    select 
(select count(*) from Orders where year(OrderDate) = 1997 and month(OrderDate) = 1)  as "January",
(select count(*) from Orders where year(OrderDate) = 1997 and month(OrderDate) = 2) as "February",
(select count(*) from Orders where year(OrderDate) = 1997 and month(OrderDate) = 3) as "March",
(select count(*) from Orders where year(OrderDate) = 1997 and month(OrderDate) = 4) as "April",
(select count(*) from Orders where year(OrderDate) = 1997 and month(OrderDate) = 5) as "May",
(select count(*) from Orders where year(OrderDate) = 1997 and month(OrderDate) = 6) as "June",
(select count(*) from Orders where year(OrderDate) = 1997 and month(OrderDate) = 7) as "July",
(select count(*) from Orders where year(OrderDate) = 1997 and month(OrderDate) = 8) as "August",
(select count(*) from Orders where year(OrderDate) = 1997 and month(OrderDate) = 9) as "September",
(select count(*) from Orders where year(OrderDate) = 1997 and month(OrderDate) = 10) as "October",
(select count(*) from Orders where year(OrderDate) = 1997 and month(OrderDate) = 11) as "November",
(select count(*) from Orders where year(OrderDate) = 1997 and month(OrderDate) = 12) as "December"
from Orders group by 1,2,3,4,5,6,7,8,9,10,11,12
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
	where ShipPostalCode is not null
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
    SELECT c.CategoryName,
		avg(p.UnitPrice) as "AvgPrice"
FROM Products p
	join Categories c on c.CategoryID = p.CategoryID
    group by 1
    order by 2 desc, 1
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
    select
*,
count(T.OrderDate) as "Total Number of Orders"
from (SELECT date_format(OrderDate, '%Y-%m-%d %T') as "OrderDate"
FROM Orders where year(OrderDate) = 1998 and month(OrderDate) between 1 and 12 and day(OrderDate) between 1 and 31) T
group by 1
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
o.CustomerID,
c.CompanyName,
sum(od.Quantity*od.UnitPrice) as "TotalOrdersAmount, $"
FROM Orders o
	join Customers c on c.CustomerID = o.CustomerID
    join OrderDetails od on od.OrderID = o.OrderID
group by 1
having sum(od.Quantity*od.UnitPrice) > 10000
order by 3 desc, 1 desc
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
e.EmployeeID,
concat(e.FirstName, " ", e.LastName) as "Employee Full Name",
sum(od.UnitPrice*od.Quantity) as "Amount, $"
FROM Employees e
	join Orders o on o.EmployeeID = e.EmployeeID
    join OrderDetails od on od.OrderID = o.OrderID
group by 1
order by 3 desc limit 1
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
    sum(UnitPrice*Quantity) as "Maximum Purchase Amount, $"
FROM OrderDetails
group by 1
order by 2 desc limit 1
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
	distinct
            Customers.CompanyName,
            Products.ProductName,
            OrderDetails.UnitPrice as "PricePerItem"
        FROM Customers 
        JOIN Orders ON Customers.CustomerID=Orders.CustomerID
        JOIN OrderDetails ON Orders.OrderID=OrderDetails.OrderID
        JOIN Products ON OrderDetails.ProductID=Products.ProductID
        WHERE OrderDetails.UnitPrice = (SELECT
                    MAX(od.UnitPrice)
                FROM Customers as c
                JOIN Orders as o ON o.CustomerID=c.CustomerID
                JOIN OrderDetails as od ON od.OrderID=o.OrderID
                WHERE Customers.CompanyName=c.CompanyName
                )
		
        ORDER BY 3 DESC, 1, 2;
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
