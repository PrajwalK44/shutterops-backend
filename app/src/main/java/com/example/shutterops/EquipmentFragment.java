package com.example.shutterops;

import android.app.AlertDialog;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.ItemTouchHelper;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;
import java.util.List;

public class EquipmentFragment extends Fragment {

    private final List<EquipmentAdapter.EquipmentItem> equipmentItems = new ArrayList<>();
    private EquipmentAdapter equipmentAdapter;

    public EquipmentFragment() {
        // Required empty public constructor.
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_equipment, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        RecyclerView recyclerView = view.findViewById(R.id.rv_equipment);
        recyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));

        setHardcodedEquipment();

        equipmentAdapter = new EquipmentAdapter(equipmentItems, new EquipmentAdapter.OnEquipmentInteractionListener() {
            @Override
            public void onItemClick(int position) {
                // Click listener: show selected equipment name in toast.
                Toast.makeText(requireContext(), "Item Clicked: " + equipmentItems.get(position).name, Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onItemLongPress(int position) {
                // Long press handling: open dialog to update equipment state.
                showStatusDialog(position);
            }
        });

        recyclerView.setAdapter(equipmentAdapter);

        // Swipe gesture: remove item on left or right swipe.
        ItemTouchHelper.SimpleCallback swipeCallback = new ItemTouchHelper.SimpleCallback(0,
                ItemTouchHelper.LEFT | ItemTouchHelper.RIGHT) {
            @Override
            public boolean onMove(@NonNull RecyclerView recyclerView,
                                  @NonNull RecyclerView.ViewHolder viewHolder,
                                  @NonNull RecyclerView.ViewHolder target) {
                return false;
            }

            @Override
            public void onSwiped(@NonNull RecyclerView.ViewHolder viewHolder, int direction) {
                int position = viewHolder.getBindingAdapterPosition();
                if (position != RecyclerView.NO_POSITION) {
                    equipmentAdapter.removeAt(position);
                    Toast.makeText(requireContext(), "Item Swiped", Toast.LENGTH_SHORT).show();
                }
            }
        };
        new ItemTouchHelper(swipeCallback).attachToRecyclerView(recyclerView);
    }

    private void setHardcodedEquipment() {
        equipmentItems.clear();
        equipmentItems.add(new EquipmentAdapter.EquipmentItem("Canon R6", "Available"));
        equipmentItems.add(new EquipmentAdapter.EquipmentItem("Sony A7III", "In Use"));
        equipmentItems.add(new EquipmentAdapter.EquipmentItem("Tripod Stand", "Under Maintenance"));
    }

    private void showStatusDialog(int position) {
        final String[] statusOptions = {"Available", "In Use", "Damaged", "Under Maintenance"};

        // AlertDialog implementation for status change on long press.
        new AlertDialog.Builder(requireContext())
                .setTitle("Update Equipment Status")
                .setItems(statusOptions, (dialog, which) -> {
                    String selectedStatus = statusOptions[which];
                    equipmentAdapter.updateStatusAt(position, selectedStatus);
                    Toast.makeText(requireContext(), "Status updated to " + selectedStatus, Toast.LENGTH_SHORT).show();
                })
                .setNegativeButton("Cancel", null)
                .show();
    }
}
