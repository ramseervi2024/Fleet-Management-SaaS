import { apiSlice } from "./apiSlice";

export const fleetApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Vehicles
        getVehicles: builder.query({
            query: () => '/vehicles',
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
        }),
        // Trips
        getTrips: builder.query({
            query: () => '/trips',
            providesTags: ['Trip'],
        }),
        // Maintenance
        getMaintenance: builder.query({
            query: () => '/maintenance',
            providesTags: ['Maintenance'],
        }),
        // Fuel Logs
        getFuelLogs: builder.query({
            query: () => '/fuel-logs',
            providesTags: ['FuelLog'],
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
    useGetMaintenanceQuery,
    useGetFuelLogsQuery
} = fleetApi;
