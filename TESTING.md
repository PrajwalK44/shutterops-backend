# ShutterOps API Testing Guide

This guide demonstrates the end-to-end workflow of the ShutterOps photography operations system, from event creation to final output delivery.

Base URL used in examples:

```text
http://localhost:5000
```

## Step 1: Create Event

**Endpoint**

```http
POST /api/events
```

**Sample Request Body**

```json
{
  "name": "Tech Fest 2026",
  "description": "Campus technical fest documentation",
  "date": "2026-04-10",
  "venue": "Main Auditorium",
  "created_by": "11111111-1111-1111-1111-111111111111"
}
```

**Sample Response**

```json
{
  "success": true,
  "data": {
    "event_id": "9f67d880-f337-4e91-9694-59d8dbec4d06",
    "name": "Tech Fest 2026",
    "description": "Campus technical fest documentation",
    "date": "2026-04-10",
    "venue": "Main Auditorium",
    "status": "upcoming",
    "created_by": "11111111-1111-1111-1111-111111111111",
    "created_at": "2026-04-03T10:00:00.000Z",
    "updated_at": "2026-04-03T10:00:00.000Z"
  },
  "message": "Event created successfully"
}
```

**What this step does**
Creates a new event record and returns `event_id`, which is required for task slot creation.

**cURL**

```bash
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Tech Fest 2026",
    "description":"Campus technical fest documentation",
    "date":"2026-04-10",
    "venue":"Main Auditorium",
    "created_by":"11111111-1111-1111-1111-111111111111"
  }'
```

## Step 2: Create Task Slot

**Endpoint**

```http
POST /api/events/{event_id}/task-slots
```

**Sample Request Body**

```json
{
  "title": "Main Stage Coverage",
  "description": "Capture keynote and audience interactions",
  "slot_type": "photography",
  "start_time": "2026-04-10T09:00:00Z",
  "end_time": "2026-04-10T12:00:00Z"
}
```

**Sample Response**

```json
{
  "success": true,
  "data": {
    "slot_id": "ab90d9c6-7f5c-4471-9895-1838f5d9e48d",
    "event_id": "9f67d880-f337-4e91-9694-59d8dbec4d06",
    "title": "Main Stage Coverage",
    "description": "Capture keynote and audience interactions",
    "slot_type": "photography",
    "assigned_to": null,
    "status": "open",
    "upload_url": null,
    "verified_by": null,
    "verified_at": null,
    "delivery_timestamp": null,
    "created_at": "2026-04-03T10:03:00.000Z",
    "updated_at": "2026-04-03T10:03:00.000Z"
  },
  "message": "Task slot created successfully"
}
```

**What this step does**
Creates a task slot under the event and returns `slot_id`, which is used in assignment and pipeline APIs.

**cURL**

```bash
curl -X POST http://localhost:5000/api/events/9f67d880-f337-4e91-9694-59d8dbec4d06/task-slots \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Main Stage Coverage",
    "description":"Capture keynote and audience interactions",
    "slot_type":"photography",
    "start_time":"2026-04-10T09:00:00Z",
    "end_time":"2026-04-10T12:00:00Z"
  }'
```

## Step 3: Assign Roles

**Endpoint**

```http
POST /api/task-slots/{slot_id}/assign
```

**Sample Request Body**

```json
{
  "user_id": "22222222-2222-2222-2222-222222222222"
}
```

**Sample Response**

```json
{
  "success": true,
  "data": {
    "slot_id": "ab90d9c6-7f5c-4471-9895-1838f5d9e48d",
    "status": "assigned",
    "assigned_to": "22222222-2222-2222-2222-222222222222",
    "updated_at": "2026-04-03T10:05:00.000Z"
  },
  "message": "User assigned to slot successfully"
}
```

**What this step does**
Assigns an available user to the slot and moves slot status from `open` to `assigned`.

**cURL**

```bash
curl -X POST http://localhost:5000/api/task-slots/ab90d9c6-7f5c-4471-9895-1838f5d9e48d/assign \
  -H "Content-Type: application/json" \
  -d '{
    "user_id":"22222222-2222-2222-2222-222222222222"
  }'
```

## Step 4: Upload Photos

**Endpoint**

```http
POST /api/task-slots/{slot_id}/upload
```

**Sample Request Body**

```json
{
  "upload_url": "https://cdn.shutterops.local/uploads/techfest-2026/main-stage.zip"
}
```

**Sample Response**

```json
{
  "success": true,
  "data": {
    "slot_id": "ab90d9c6-7f5c-4471-9895-1838f5d9e48d",
    "upload_url": "https://cdn.shutterops.local/uploads/techfest-2026/main-stage.zip",
    "status": "raw_uploaded",
    "updated_at": "2026-04-03T10:15:00.000Z"
  },
  "message": "Photo uploaded to slot successfully"
}
```

**What this step does**
Stores the upload URL and marks the slot as ready for review in the current workflow.

**cURL**

```bash
curl -X POST http://localhost:5000/api/task-slots/ab90d9c6-7f5c-4471-9895-1838f5d9e48d/upload \
  -H "Content-Type: application/json" \
  -d '{
    "upload_url":"https://cdn.shutterops.local/uploads/techfest-2026/main-stage.zip"
  }'
```

## Step 5: Update Status (Editing Pipeline)

**Endpoint**

```http
PATCH /api/task-slots/{slot_id}/status
```

**Requested pipeline labels**

```text
Assigned -> Raw_Uploaded -> Sorted -> Edited
```

**Current API-compatible status progression**

```text
assigned -> raw_uploaded -> sorted -> edited
```

**Sample Request Body**

```json
{
  "status": "Sorted"
}
```

**Sample Response**

```json
{
  "success": true,
  "data": {
    "slot_id": "ab90d9c6-7f5c-4471-9895-1838f5d9e48d",
    "status": "sorted",
    "updated_at": "2026-04-03T10:20:00.000Z"
  },
  "message": "Task slot status updated successfully"
}
```

**What this step does**
Advances slot processing through the editing pipeline via controlled status transitions.

**cURL**

```bash
curl -X PATCH http://localhost:5000/api/task-slots/ab90d9c6-7f5c-4471-9895-1838f5d9e48d/status \
  -H "Content-Type: application/json" \
  -d '{
    "status":"Sorted"
  }'
```

## Step 6: Verify Output

**Endpoint**

```http
POST /api/task-slots/{slot_id}/verify
```

**Sample Request Body**

```json
{
  "verified_by": "33333333-3333-3333-3333-333333333333"
}
```

**Sample Response**

```json
{
  "success": true,
  "data": {
    "slot_id": "ab90d9c6-7f5c-4471-9895-1838f5d9e48d",
    "status": "verified",
    "verified_by": "33333333-3333-3333-3333-333333333333",
    "verified_at": "2026-04-03T10:30:00.000Z",
    "updated_at": "2026-04-03T10:30:00.000Z"
  },
  "message": "Slot verified successfully"
}
```

**What this step does**
Marks the slot output as reviewed and approved for final delivery.

**cURL**

```bash
curl -X POST http://localhost:5000/api/task-slots/ab90d9c6-7f5c-4471-9895-1838f5d9e48d/verify \
  -H "Content-Type: application/json" \
  -d '{
    "verified_by":"33333333-3333-3333-3333-333333333333"
  }'
```

## Step 7: Deliver Final Output

**Endpoint**

```http
POST /api/task-slots/{slot_id}/deliver
```

**Sample Request Body**

```json
{}
```

**Sample Response**

```json
{
  "success": true,
  "data": {
    "slot_id": "ab90d9c6-7f5c-4471-9895-1838f5d9e48d",
    "status": "delivered",
    "delivery_timestamp": "2026-04-03T10:35:00.000Z",
    "updated_at": "2026-04-03T10:35:00.000Z"
  },
  "message": "Slot delivered successfully"
}
```

**What this step does**
Finalizes the workflow and records delivery completion timestamp.

**cURL**

```bash
curl -X POST http://localhost:5000/api/task-slots/ab90d9c6-7f5c-4471-9895-1838f5d9e48d/deliver
```

## Testing Order (Quick Run)

1. `POST /api/events`
2. `POST /api/events/{event_id}/task-slots`
3. `POST /api/task-slots/{slot_id}/assign`
4. `POST /api/task-slots/{slot_id}/upload` (status becomes `raw_uploaded`)
5. `PATCH /api/task-slots/{slot_id}/status` (to `sorted`)
6. `PATCH /api/task-slots/{slot_id}/status` (to `edited`)
7. `POST /api/task-slots/{slot_id}/verify`
8. `POST /api/task-slots/{slot_id}/deliver`

## Important Notes

- Keep these IDs from responses for subsequent requests: `event_id`, `slot_id`, `user_id`.
- Task slot status is governed by enum/transition rules. Invalid transitions return a `400` error.
- Editing pipeline is now: `assigned -> raw_uploaded -> sorted -> edited`.
- Delivery works only after verification. If status is not `verified`, `/deliver` returns a validation error.
- Verification requires slot status `edited` (legacy `submitted` is accepted for backward compatibility).
- `POST /upload` expects `upload_url` and sets status to `raw_uploaded`.
- In Postman, save `event_id`, `slot_id`, and `user_id` as environment variables and reference them as `{{event_id}}`, `{{slot_id}}`, and `{{user_id}}`.
