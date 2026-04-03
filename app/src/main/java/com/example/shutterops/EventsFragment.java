package com.example.shutterops;

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

public class EventsFragment extends Fragment {

    private final List<EventsAdapter.EventItem> eventItems = new ArrayList<>();
    private EventsAdapter eventsAdapter;

    public EventsFragment() {
        // Required empty public constructor.
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_events, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        RecyclerView recyclerView = view.findViewById(R.id.rv_events);
        recyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));

        setHardcodedEvents();

        eventsAdapter = new EventsAdapter(eventItems, new EventsAdapter.OnEventInteractionListener() {
            @Override
            public void onItemClick(int position) {
                // Click listener: show selected event title in toast.
                Toast.makeText(requireContext(), "Item Clicked: " + eventItems.get(position).title, Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onItemLongPress(int position) {
                // Long press listener: remove item from RecyclerView.
                eventsAdapter.removeAt(position);
                Toast.makeText(requireContext(), "Item Deleted", Toast.LENGTH_SHORT).show();
            }
        });

        recyclerView.setAdapter(eventsAdapter);

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
                    eventsAdapter.removeAt(position);
                    Toast.makeText(requireContext(), "Item Swiped", Toast.LENGTH_SHORT).show();
                }
            }
        };
        new ItemTouchHelper(swipeCallback).attachToRecyclerView(recyclerView);
    }

    private void setHardcodedEvents() {
        eventItems.clear();
        eventItems.add(new EventsAdapter.EventItem("Tech Fest 2026", "12 Jan 2026", "Main Auditorium"));
        eventItems.add(new EventsAdapter.EventItem("Photography Workshop", "08 Feb 2026", "Media Lab"));
        eventItems.add(new EventsAdapter.EventItem("College Cultural Fest", "22 Mar 2026", "Central Ground"));
    }
}
