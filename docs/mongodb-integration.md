# MongoDB Integration Documentation

## Overview
The application now stores all quiz submissions and artist profiles in MongoDB, allowing for scalable data management and future enrichment from multiple sources.

## Database Schema

### Collections

#### 1. **Artist Profiles** (`artistProfiles`)
Stores comprehensive artist information with fields for:
- Core profile data (name, location, genres, instruments)
- Pathway analysis (primary/secondary paths, scores, history)
- Career stage tracking
- External data sources (Spotify, Instagram, YouTube, etc.)
- Engagement metrics
- Custom tags for segmentation

#### 2. **Quiz Submissions** (`quizSubmissions`)
Records each quiz completion with:
- Complete quiz responses
- AI-generated results and recommendations
- Source tracking (UTM parameters, referrer)
- Timestamp and metadata

#### 3. **Lead Events** (`leadEvents`)
Tracks all artist interactions:
- Event types (quiz_completed, pdf_purchased, email_opened, etc.)
- Event-specific data
- Timestamps and metadata

## Setup Instructions

1. **Add MongoDB URI to environment variables**:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
   ```

2. **The submit-lead API now**:
   - Validates email format and quiz responses
   - Creates or updates artist profile
   - Stores quiz submission with full results
   - Creates event record
   - Still sends to GHL webhook if configured (optional)

## Data Flow

1. User completes quiz → `submit-lead` API called
2. Data validated and sanitized
3. Artist profile created/updated in MongoDB
4. Quiz submission stored with all results
5. Event logged for analytics
6. Optional: Data forwarded to GHL webhook

## Future Enhancements

The schema is designed to support:
- **External API Integration**: Spotify, Instagram, YouTube data enrichment
- **Advanced Analytics**: Track artist growth over time
- **Segmentation**: Use tags and engagement data for targeted campaigns
- **Multi-source Profiles**: Combine data from various touchpoints
- **Performance Tracking**: Monitor artist career progression

## API Endpoints

### Current
- `POST /api/submit-lead` - Stores quiz data in MongoDB

### Planned
- `GET /api/artists/:email` - Retrieve artist profile
- `PUT /api/artists/:email` - Update artist profile
- `GET /api/artists` - List artists with filtering
- `POST /api/artists/:email/enrich` - Trigger external data sync

## Testing

Run the test script to verify MongoDB connection:
```bash
node scripts/test-mongodb.js
```

## Security Considerations

- Email validation prevents invalid data
- Input sanitization removes potential XSS
- Database indexes optimize query performance
- Connection pooling manages resources efficiently