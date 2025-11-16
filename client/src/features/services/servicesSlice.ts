import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Service } from "../../types/Service";

interface servicesState {
    services: Service[];
    loading: boolean;
    error: string | null;
    selectedService: Service | null;
}

const initialState: servicesState = {
    services: [],
    loading: false,
    error: null,
    selectedService: null
}

const servicesSlice = createSlice({
    name: 'services',
    initialState,
    reducers: {
        fetchServicesStart(state) {
            state.loading = true;
            state.error = null;
        },
        fetchServicesSuccess(state, action: PayloadAction<Service[]>) {
            state.loading = false;
            state.services = action.payload;
        },
        fetchServicesFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        setSelectedService(state, action: PayloadAction<Service | null>) {
            state.selectedService = action.payload;
        },
        addService(state, action: PayloadAction<Service>) {
            state.services.push(action.payload);
        },
        updateService(state, action: PayloadAction<Service>) {
            const idx = state.services.findIndex(s => s._id === action.payload._id);
            if(idx !== -1) {
                state.services[idx] = action.payload;
            }
        },
        deleteService(state, action: PayloadAction<string>) {
            state.services = state.services.filter(s => s._id !== action.payload);
        },
    },
});

export const {
    fetchServicesStart,
    fetchServicesSuccess,
    fetchServicesFailure,
    setSelectedService,
    addService,
    updateService,
    deleteService
} = servicesSlice.actions;

export default servicesSlice.reducer;