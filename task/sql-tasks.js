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
	    sum(UnitPrice * Quantity) as "Order Total Price",
	    round( (sum(Discount * Quantity)/sum(UnitPrice * Quantity))*100,3) as "Total Order Discount, %"
    FROM OrderDetails
    group by OrderID 
    order BY OrderID desc
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
	    CustomerId,CompanyName 
	from Customers
    where Country = 'USA' and Fax is null 
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
	    CustomerId as 'Customer Id',
	    count(OrderID) as 'Total number of Orders',
	    round((select count(OrderID) from Orders where CustomerID = o.CustomerID )*100/(select count(*) from Orders),5) as '% of all orders'
    from Orders as o
    group by CustomerID
    order by 3 desc, CustomerId asc
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
	    ProductId as 'ProductId',
	    ProductName ,
	    QuantityPerUnit 
    from Products
    where ProductName >= 'A' and ProductName <= 'G'
    order by ProductName asc
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
	    Products.ProductName ,
	    Categories.CategoryName ,
	    Suppliers.CompanyName as 'SupplierCompanyName'
    from Products
    join Categories on Products.CategoryID = Categories.CategoryID 
    join Suppliers on Products.SupplierID = Suppliers.SupplierID 
    order by Products.ProductName, Suppliers.CompanyName
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
	    e1.EmployeeID as "EmployeeId",
	    CONCAT(e1.FirstName, ' ', e1.LastName) AS "FullName",
	    IFNULL(CONCAT(e2.FirstName, ' ', e2.LastName),"-") AS "ReportsTo"
    from Employees e1 left join Employees e2 on e1.ReportsTo = e2.EmployeeID 
    order by e1.EmployeeID 
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
	    count(p.ProductName) as 'TotalNumberOfProducts' 
    from Categories c left join Products p on c.CategoryID = p.CategoryID 
    group by c.CategoryName
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
    select
	    CustomerID ,
	    ContactName 
    from Customers c 
    where ContactName like 'F__n%'
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
    select
	    ProductID ,
	    ProductName 
    from Products p where Discontinued != 0
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
    select
	    ProductName,
	    UnitPrice 
    from Products p where UnitPrice between 5 and 15
    order by UnitPrice , ProductName 
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
    select * from (
        select 
            ProductName,
            UnitPrice
        from Products order by UnitPrice desc limit 20) t
    order by UnitPrice, ProductName;
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
    select 
	    count(ProductId) as 'TotalOfCurrentProducts',
	    sum(case when Discontinued = 1 then 1 else 0 end) as "TotalOfDiscontinuedProducts"
    from Products
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
    select 
	    ProductName ,
	    UnitsOnOrder as 'UnitsOnOrder',
	    UnitsInStock 
    from Products where UnitsInStock < UnitsOnOrder 
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
	    SUM(case when month(OrderDate) = 1 then 1 else 0 end) as "January",
	    SUM(case when month(OrderDate) = 2 then 1 else 0 end) as "February",
	    SUM(case when month(OrderDate) = 3 then 1 else 0 end) as "March",
	    SUM(case when month(OrderDate) = 4 then 1 else 0 end) as "April",
	    SUM(case when month(OrderDate) = 5 then 1 else 0 end) as "May",
	    SUM(case when month(OrderDate) = 6 then 1 else 0 end) as "June",
	    SUM(case when month(OrderDate) = 7 then 1 else 0 end) as "July",
	    SUM(case when month(OrderDate) = 8 then 1 else 0 end) as "August",
	    SUM(case when month(OrderDate) = 9 then 1 else 0 end) as "September",
	    SUM(case when month(OrderDate) = 10 then 1 else 0 end) as "October",
	    SUM(case when month(OrderDate) = 11 then 1 else 0 end) as "November",
	    SUM(case when month(OrderDate) = 12 then 1 else 0 end) as "December"
    from
	    Orders
    where
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
    select 
	    OrderID ,
	    CustomerID ,
	    ShipCountry 
    from Orders where ShipPostalCode is not null 
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
    select 
	    CategoryName ,
	    round(avg(p.UnitPrice ),4)as AvgPrice
    from Categories c join Products p on c.CategoryID = p.CategoryID 
    group by c.CategoryID 
    order by AvgPrice desc , CategoryName 
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
    select 
        DATE_FORMAT(OrderDate, '%Y-%m-%d %T') as 'OrderDate',
	    count(OrderID ) as "Total Number of Orders"
    from Orders where OrderDate between '1998-01-01' and '1999-01-01'
    group by OrderDate  
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
    select 
	    c.CustomerID ,
	    c.CompanyName ,
	    SUM(od.UnitPrice * od.Quantity ) as "TotalOrdersAmount, $"
    from Customers c join Orders o on c.CustomerID = o.CustomerID join OrderDetails od on o.OrderID = od.OrderID
    where 3 is not null
    group by c.CustomerID 
    having SUM(od.UnitPrice * od.Quantity)>10000
    order by 3 desc, c.CustomerID 
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
    select
	    e.EmployeeID ,
	    concat(e.FirstName, ' ', e.LastName ) as "Employee Full Name",
	    SUM(od.UnitPrice * od.Quantity ) as "Amount, $"
    from Employees e join Orders o on e.EmployeeID = o.EmployeeID join OrderDetails od on o.OrderID = od.OrderID
    group by e.EmployeeID 
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
    select
	    OrderID ,
	    Sum(UnitPrice * Quantity ) as "Maximum Purchase Amount, $"
    from OrderDetails od
    group by OrderID 
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
    select distinct 
        c.CompanyName as "CompanyName",
	    p.ProductName as "ProductName",
	    od.UnitPrice as "PricePerItem"
    from Products p 
    join OrderDetails od on p.ProductID = od.ProductID 
    join Orders o on od.OrderID = o.OrderID 
    join Customers c on o.CustomerID = c.CustomerID
    where od.UnitPrice = (
        select 
            max(od2.UnitPrice )
        from Customers c1
        join Orders o2 on o2.CustomerID = c1.CustomerID 
        join OrderDetails od2 on o2.OrderID = od2.OrderID 
        where c1.CompanyName = c.CompanyName 
    ) 
    order by od.UnitPrice desc, c.CompanyName asc, p.ProductName asc 
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
