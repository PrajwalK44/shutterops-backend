package com.example.shutterops;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

public class EventsAdapter extends RecyclerView.Adapter<EventsAdapter.EventViewHolder> {

    public interface OnEventInteractionListener {
        void onItemClick(int position);

        void onItemLongPress(int position);
    }

    private final List<EventItem> events;
    private final OnEventInteractionListener listener;

    public EventsAdapter(List<EventItem> events, OnEventInteractionListener listener) {
        this.events = events;
        this.listener = listener;
    }

    @NonNull
    @Override
    public EventViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_event, parent, false);
        return new EventViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull EventViewHolder holder, int position) {
        EventItem event = events.get(position);
        holder.tvTitle.setText(event.title);
        holder.tvDate.setText(event.date);
        holder.tvLocation.setText(event.location);
    }

    @Override
    public int getItemCount() {
        return events.size();
    }

    public EventItem removeAt(int position) {
        EventItem removed = events.remove(position);
        notifyItemRemoved(position);
        return removed;
    }

    static class EventViewHolder extends RecyclerView.ViewHolder {
        TextView tvTitle;
        TextView tvDate;
        TextView tvLocation;

        EventViewHolder(@NonNull View itemView) {
            super(itemView);
            tvTitle = itemView.findViewById(R.id.tv_event_title);
            tvDate = itemView.findViewById(R.id.tv_event_date);
            tvLocation = itemView.findViewById(R.id.tv_event_location);
        }
    }

    @Override
    public void onViewAttachedToWindow(@NonNull EventViewHolder holder) {
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

    public static class EventItem {
        public final String title;
        public final String date;
        public final String location;

        public EventItem(String title, String date, String location) {
            this.title = title;
            this.date = date;
            this.location = location;
        }
    }
}
