package com.example.shutterops;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.google.android.material.button.MaterialButton;

public class HomeFragment extends Fragment {

    public HomeFragment() {
        // Required empty public constructor.
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_home, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        MaterialButton btnOpenEvents = view.findViewById(R.id.btn_open_events);
        MaterialButton btnOpenEquipment = view.findViewById(R.id.btn_open_equipment);

        // Button interaction: move ViewPager2 to Events (index 0, left page).
        btnOpenEvents.setOnClickListener(v -> {
            if (requireActivity() instanceof DashboardActivity) {
                ((DashboardActivity) requireActivity()).navigateToPage(0);
            }
        });

        // Button interaction: move ViewPager2 to Equipment (index 2, right page).
        btnOpenEquipment.setOnClickListener(v -> {
            if (requireActivity() instanceof DashboardActivity) {
                ((DashboardActivity) requireActivity()).navigateToPage(2);
            }
        });
    }
}
