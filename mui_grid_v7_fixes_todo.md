# Material UI v7 Grid Component Fixes

## Issues Identified
- Material UI v7 has renamed Grid2 to Grid and the old Grid to GridLegacy
- The API for Grid components has changed significantly
- Current implementation mixes incompatible props (`item`, `component`, and `size`)
- Inconsistent Grid component usage across different files

## Files to Fix
1. [x] Dashboard.tsx
2. [x] FirewallDialog.tsx
3. [x] OrganizationDialog.tsx
4. [x] UserDialog.tsx
5. [x] Organizations.tsx
6. [x] Users.tsx
7. [x] Firewalls.tsx

## Fix Strategy
1. Remove the `item` prop from all Grid components (no longer needed in v7)
2. Remove the `component="div"` prop (not needed with the new API)
3. Keep the `size` prop with object format for responsive sizing
4. Ensure container Grid components have the `container` prop
