package com.example.shutterops;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

public class EquipmentAdapter extends RecyclerView.Adapter<EquipmentAdapter.EquipmentViewHolder> {

    public interface OnEquipmentInteractionListener {
        void onItemClick(int position);

        void onItemLongPress(int position);
    }

    private final List<EquipmentItem> equipmentList;
    private final OnEquipmentInteractionListener listener;

    public EquipmentAdapter(List<EquipmentItem> equipmentList, OnEquipmentInteractionListener listener) {
        this.equipmentList = equipmentList;
        this.listener = listener;
    }

    @NonNull
    @Override
    public EquipmentViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_equipment_status, parent, false);
        return new EquipmentViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull EquipmentViewHolder holder, int position) {
        EquipmentItem item = equipmentList.get(position);
        holder.tvName.setText(item.name);
        holder.tvStatus.setText(item.status);

        // Status badge colors: green=Available, blue=In Use, red=Damaged, orange=Under Maintenance.
        if ("Available".equals(item.status)) {
            holder.tvStatus.setTextColor(holder.itemView.getResources().getColor(R.color.status_green));
            holder.tvStatus.setBackgroundResource(R.drawable.bg_status_verified);
        } else if ("In Use".equals(item.status)) {
            holder.tvStatus.setTextColor(holder.itemView.getResources().getColor(R.color.primary_blue));
            holder.tvStatus.setBackgroundResource(R.drawable.bg_status_in_use);
        } else if ("Damaged".equals(item.status)) {
            holder.tvStatus.setTextColor(holder.itemView.getResources().getColor(R.color.status_red));
            holder.tvStatus.setBackgroundResource(R.drawable.bg_status_danger);
        } else {
            holder.tvStatus.setTextColor(holder.itemView.getResources().getColor(R.color.status_orange));
            holder.tvStatus.setBackgroundResource(R.drawable.bg_status_maintenance);
        }
    }

    @Override
    public int getItemCount() {
        return equipmentList.size();
    }

    public EquipmentItem removeAt(int position) {
        EquipmentItem removed = equipmentList.remove(position);
        notifyItemRemoved(position);
        return removed;
    }

    public void updateStatusAt(int position, String newStatus) {
        if (position >= 0 && position < equipmentList.size()) {
            equipmentList.get(position).status = newStatus;
            notifyDataSetChanged();
        }
    }

    static class EquipmentViewHolder extends RecyclerView.ViewHolder {
        TextView tvName;
        TextView tvStatus;

        EquipmentViewHolder(@NonNull View itemView) {
            super(itemView);
            tvName = itemView.findViewById(R.id.tv_equipment_name);
            tvStatus = itemView.findViewById(R.id.tv_equipment_status);
        }
    }

    @Override
    public void onViewAttachedToWindow(@NonNull EquipmentViewHolder holder) {
        super.onViewAttachedToWindow(holder);
        holder.itemView.setOnClickListener(v -> {
            int position = holder.getBindingAdapterPosition();
            if (position != RecyclerView.NO_POSITION) {
                // Click listener for Experiment 4.
                listener.onItemClick(position);
            }
        });

        holder.itemView.setOnLongClickListener(v -> {
            int position = holder.getBindingAdapterPosition();
            if (position != RecyclerView.NO_POSITION) {
                // Long press listener for Experiment 4.
                listener.onItemLongPress(position);
                return true;
            }
            return false;
        });
    }

    public static class EquipmentItem {
        public final String name;
        public String status;

        public EquipmentItem(String name, String status) {
            this.name = name;
            this.status = status;
        }
    }
}
