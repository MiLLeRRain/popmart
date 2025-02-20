# Database Indexing and Performance Optimization

This document provides comprehensive guidance on database indexing strategies and performance optimization for the POPMART Blind Box Calculator Mini Program.

## Database Indexing

### Primary Key Indexes

Primary key indexes are automatically created for the `_id` field in each collection.

```javascript
// Series Collection Example
{
  _id: "series_001",  // Primary key index
  name: "MOLLY Forest Series",
  totalBoxes: 12
}
```

### Foreign Key Indexes

Foreign key indexes improve the performance of relationship queries between collections.

```javascript
// Items Collection with Foreign Key Index
db.collection('items').createIndex({
  seriesId: 1  // Create index on seriesId field
})

// Example Query
db.collection('items').where({
  seriesId: 'series_001'  // Efficient query using index
}).get()
```

### Compound Indexes

Compound indexes support queries that filter on multiple fields.

```javascript
// Create compound index on series and release date
db.collection('series').createIndex({
  category: 1,
  releaseDate: -1
})

// Efficient query using compound index
db.collection('series').where({
  category: 'limited',
  releaseDate: db.command.gte(new Date('2023-01-01'))
}).get()

// Create compound index for series items sorting
db.collection('items').createIndex({
  seriesId: 1,
  index: 1
}, {
  name: 'idx_items_seriesId_index'
})

// Efficient query using the compound index
db.collection('items')
  .where('seriesId', '==', 'series_001')
  .orderBy('index', 'asc')
  .get()
```

### Unique Indexes

Unique indexes ensure field values are unique across documents.

```javascript
// Create unique index on series code
db.collection('series').createIndex({
  code: 1
}, {
  unique: true
})

// This will fail if duplicate code exists
db.collection('series').add({
  code: 'MLY2023',
  name: 'MOLLY 2023'
})
```

## Performance Optimization

### Index Selection

1. **Analyze Query Patterns**
   ```javascript
   // Common query pattern in our app
   db.collection('items').where({
     seriesId: currentSeriesId,
     status: 'available'
   }).get()
   
   // Create optimal index
   db.collection('items').createIndex({
     seriesId: 1,
     status: 1
   })
   ```

2. **Avoid Over-Indexing**
   - Only create indexes that support common queries
   - Remove unused indexes
   - Monitor index usage

### Query Optimization

1. **Efficient Filtering**
   ```javascript
   // Good: Using indexed fields in filters
   db.collection('series')
     .where('category', '==', 'limited')
     .orderBy('releaseDate', 'desc')
     .limit(10)
     .get()
   
   // Bad: Filtering on non-indexed field
   db.collection('series')
     .where('description', '!=', '')
     .get()
   ```

2. **Projection**
   ```javascript
   // Only fetch needed fields
   db.collection('series').field({
     name: true,
     imageUrl: true,
     totalBoxes: true
   }).get()
   ```

### Data Structure

1. **Denormalization**
   ```javascript
   // Denormalized series document
   {
     _id: "series_001",
     name: "MOLLY Forest",
     totalBoxes: 12,
     // Denormalized category data
     category: {
       id: "cat_001",
       name: "Limited Edition",
       priority: 1
     }
   }
   ```

2. **Document Size**
   - Keep documents under 1MB
   - Use references for large data
   - Split data across collections when necessary

## Best Practices

1. **Index Design**
   - Create indexes based on query patterns
   - Use compound indexes for multi-field queries
   - Implement unique constraints where needed

2. **Query Optimization**
   - Use indexed fields in query filters
   - Implement pagination
   - Minimize returned data size

3. **Data Management**
   - Regular maintenance of indexes
   - Monitor query performance
   - Implement data archiving strategy

## Common Issues and Solutions

1. **Slow Queries**
   - Review and optimize indexes
   - Analyze query patterns
   - Implement caching where appropriate

2. **Large Result Sets**
   - Implement pagination
   - Use field projection
   - Optimize data structure

3. **Index Size**
   - Remove unused indexes
   - Monitor index usage
   - Optimize compound indexes

## Performance Monitoring

1. **Query Statistics**
   ```javascript
   // Enable performance monitoring
   const result = await db.collection('series')
     .where({
       category: 'limited'
     })
     .get({
       metrics: true  // Get query metrics
     })
   ```

2. **Index Usage**
   - Monitor index hit rates
   - Track query performance
   - Identify slow queries

## Related Documentation

- [WeChat Cloud Database Guide](https://developers.weixin.qq.com/miniprogram/en/dev/wxcloud/guide/database.html)
- [Database Performance Best Practices](https://developers.weixin.qq.com/miniprogram/en/dev/wxcloud/guide/database/performance.html)
- [Index Types and Strategies](https://developers.weixin.qq.com/miniprogram/en/dev/wxcloud/guide/database/index.html)