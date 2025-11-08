# Testing Auto-Complete Orders Feature

## How It Works
- Orders automatically move to "Completed Orders" after 3 days
- A scheduled task runs every hour to check and update old orders
- Orders with status PENDING or SHIPPED that are 3+ days old become DELIVERED

## Testing Steps

### Option 1: Quick Test (Manual Trigger)

1. **Start the backend**
   ```bash
   cd backend
   ./gradlew bootRun
   ```

2. **Place an order** through the frontend or API

3. **Make the order old** - Open H2 Console at http://localhost:8080/h2-console
   - JDBC URL: `jdbc:h2:mem:testdb`
   - Username: `sa`
   - Password: (leave empty)
   
   Run this SQL:
   ```sql
   -- Find your order ID
   SELECT * FROM orders;
   
   -- Make it 4 days old
   UPDATE orders 
   SET order_date = DATEADD('DAY', -4, CURRENT_TIMESTAMP)
   WHERE id = YOUR_ORDER_ID;
   ```

4. **Trigger auto-complete manually**
   ```bash
   # Use the test endpoint
   POST http://localhost:8080/api/orders/auto-complete-test
   Authorization: Bearer YOUR_TOKEN
   ```

5. **Check the result**
   - Refresh your Orders page
   - The order should now be in "Completed Orders" tab with status DELIVERED

### Option 2: Automatic Test (Wait for Scheduler)

1. Create an order with a date 4 days ago (using SQL above)
2. Wait up to 1 hour for the scheduler to run
3. Check the Orders page - it should automatically move to Completed

## What Happens Automatically

- **Every hour**, the system checks all PENDING and SHIPPED orders
- If an order is **3+ days old**, it's marked as DELIVERED
- Users see these orders in the "Completed Orders" tab
- Console logs show: "Auto-completed X orders older than 3 days"

## Frontend Changes

The Orders page now has two tabs:
- **Active Orders**: PENDING and SHIPPED orders
- **Completed Orders**: DELIVERED and CANCELLED orders

Orders automatically appear in the correct tab based on their status.
