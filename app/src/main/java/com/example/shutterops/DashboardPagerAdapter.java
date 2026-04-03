package com.example.shutterops;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.viewpager2.adapter.FragmentStateAdapter;

public class DashboardPagerAdapter extends FragmentStateAdapter {

    public DashboardPagerAdapter(@NonNull FragmentActivity fragmentActivity) {
        super(fragmentActivity);
    }

    @NonNull
    @Override
    public Fragment createFragment(int position) {
        // Fragment positioning: Events = 0, Home = 1, Equipment = 2.
        if (position == 0) {
            return new EventsFragment();
        }
        if (position == 1) {
            return new HomeFragment();
        }
        return new EquipmentFragment();
    }

    @Override
    public int getItemCount() {
        // Fixed pages only; no infinite scrolling.
        return 3;
    }
}
