import { apiSlice } from "./apiSlice";

export const fleetApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Vehicles
        getVehicles: builder.query({
            query: () => '/vehicles',
            transformResponse: (response) => response.vehicles,
            providesTags: ['Vehicle'],
        }),
        addVehicle: builder.mutation({
            query: (data) => ({
                url: '/vehicles',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Vehicle'],
        }),
        // Drivers
        getDrivers: builder.query({
            query: () => '/drivers',
            transformResponse: (response) => response.drivers,
            providesTags: ['Driver'],
        }),
        addDriver: builder.mutation({
            query: (data) => ({
                url: '/drivers',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Driver'],
        }),
        // Dashboard
        getDashboardStats: builder.query({
            query: () => '/dashboard/stats',
            transformResponse: (response) => response.stats,
        }),
        // Trips
        getTrips: builder.query({
            query: () => '/trips',
            transformResponse: (response) => response.trips,
            providesTags: ['Trip'],
        }),
        addTrip: builder.mutation({
            query: (data) => ({
                url: '/trips',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Trip', 'Vehicle', 'Driver'],
        }),
        // Maintenance
        getMaintenance: builder.query({
            query: () => '/maintenance',
            transformResponse: (response) => response.logs,
            providesTags: ['Maintenance'],
        }),
        addMaintenance: builder.mutation({
            query: (data) => ({
                url: '/maintenance',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Maintenance', 'Vehicle'],
        }),
        // Fuel Logs
        getFuelLogs: builder.query({
            query: () => '/fuel-logs',
            transformResponse: (response) => response.logs,
            providesTags: ['FuelLog'],
        }),
        addFuelLog: builder.mutation({
            query: (data) => ({
                url: '/fuel-logs',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['FuelLog'],
        }),
    }),
});

export const {
    useGetVehiclesQuery,
    useAddVehicleMutation,
    useGetDriversQuery,
    useAddDriverMutation,
    useGetDashboardStatsQuery,
    useGetTripsQuery,
    useAddTripMutation,
    useGetMaintenanceQuery,
    useAddMaintenanceMutation,
    useGetFuelLogsQuery,
    useAddFuelLogMutation
} = fleetApi;
