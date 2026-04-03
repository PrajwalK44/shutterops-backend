package com.example.shutterops;

import android.os.Bundle;
import android.view.WindowManager;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.viewpager2.widget.ViewPager2;

public class DashboardActivity extends AppCompatActivity {

    private ViewPager2 dashboardViewPager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Force allow screenshots by removing secure window flag if present.
        getWindow().clearFlags(WindowManager.LayoutParams.FLAG_SECURE);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_dashboard);

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.root_dashboard), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        dashboardViewPager = findViewById(R.id.view_pager_dashboard);
        dashboardViewPager.setAdapter(new DashboardPagerAdapter(this));

        if (savedInstanceState == null) {
            // Default page is HomeFragment (center, index 1).
            dashboardViewPager.setCurrentItem(1, false);
        }
    }

    public void navigateToPage(int pageIndex) {
        // ViewPager2 swipe logic: 0=Events (left), 1=Home (center), 2=Equipment (right).
        if (dashboardViewPager != null && pageIndex >= 0 && pageIndex <= 2) {
            dashboardViewPager.setCurrentItem(pageIndex, true);
        }
    }
}
