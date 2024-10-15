"use client";

import { LoggedUserData, Review as ReviewType } from "@/lib/types";
import React, { useState } from "react";
import Review from "./Review";
import { Button } from "./ui/button";

import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import YellowStar from "./../../public/yellow-star.svg";
import EmptyStar from "./../../public/empty-star.svg";
import { createReview } from "@/lib/queries";
import Link from "next/link";

const ReviewFilters = [
  {
    value: "newest",
    label: "Sort by newest",
  },
  {
    value: "rating",
    label: "Sort by rating",
  },
];

const ReviewProvider = ({
  reviews,
  user,
}: {
  reviews: ReviewType[];
  user: LoggedUserData | null;
}) => {
  const [open, setOpen] = React.useState(false);
  const [filter, setFilter] = useState("newest");
  const [rating, setRating] = useState<number>(0); // State to store the selected rating
  const [hoverRating, setHoverRating] = useState<number | null>(null); // State for hover effects
  const [comment, setComment] = useState<string>(""); // State to store the comment
  const [error, setError] = useState<string | null>(null); // State to handle error messages

  // Function to sort reviews based on the active filter
  const getSortedReviews = () => {
    if (filter === "newest") {
      return [...reviews].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (filter === "rating") {
      return [...reviews].sort((a, b) => b.rating - a.rating);
    }
    return reviews;
  };

  const sortedReviews = getSortedReviews();

  // Function to render stars based on the selected rating and hover
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <img
          key={i}
          src={i <= (hoverRating || rating) ? YellowStar.src : EmptyStar.src}
          alt={i <= (hoverRating || rating) ? "Filled Star" : "Empty Star"}
          className="cursor-pointer w-6 h-6"
          onClick={() => setRating(i)}
          onMouseEnter={() => setHoverRating(i)}
          onMouseLeave={() => setHoverRating(null)}
          width={35}
          height={35}
        />
      );
    }
    return stars;
  };

  // Handle form submission to create a review
  const handleSubmit = async () => {
    try {
      if (!comment.trim()) {
        setError("Comment cannot be empty");
        return;
      }

      if (!rating || rating < 1 || rating > 5) {
        setError("Invalid rating");
        return;
      }

      // Attempt to create the review
      await createReview({
        vehicle_id: reviews[0].vehicle_id, // Assuming all reviews are for the same vehicle
        rating,
        comment: comment.trim(),
      });

      setOpen(false); // Close the dialog after submission
      setError(null); // Reset the error state if submission is successful
    } catch (error) {
      // Handle errors and show a custom error message
      setError(
        error?.response?.data?.message ||
          "You can only review vehicles from reservations that have started."
      );
    }
  };

  return (
    <>
      <div className="flex sm:items-center sm:flex-row flex-col gap-5 items-start justify-between m-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between border-0 shadow-none"
            >
              {filter
                ? ReviewFilters.find(
                    (ReviewFilter) => ReviewFilter.value === filter
                  )?.label
                : "Select filter"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search filter" />
              <CommandList>
                <CommandEmpty>No filter found.</CommandEmpty>
                <CommandGroup>
                  {ReviewFilters.map((ReviewFilter) => (
                    <CommandItem
                      key={ReviewFilter.value}
                      value={ReviewFilter.value}
                      onSelect={(currentValue) => {
                        setFilter(currentValue === filter ? "" : currentValue);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          filter === ReviewFilter.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {ReviewFilter.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {user ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button>Write a review</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Write a review</DialogTitle>
                <DialogDescription>
                  Select the star rating and leave a comment.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="rating" className="text-right">
                    Rating
                  </Label>
                  <div className="flex space-x-2">{renderStars()}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="comment" className="text-right">
                    Comment
                  </Label>
                  <Input
                    id="comment"
                    value={comment} // Bind the input to the comment state
                    onChange={(e) => setComment(e.target.value)} // Update the comment state when typing
                    placeholder="Write your review here..."
                    className="col-span-3"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" onClick={handleSubmit}>
                  Create review
                </Button>
                {error && (
                  <p className="col-span-4 text-red-500 text-sm">{error}</p> // Display error message if any
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : (
          <Link href={"/login"}>
            <Button className="rounded-sm text-[16px] font-semibold">
              Login to review
            </Button>
          </Link>
        )}
      </div>
      <div className="flex flex-col divide-y-2 rounded-2xl bg-white px-6 py-2">
        {sortedReviews.length > 0 ? (
          sortedReviews.map((review) => (
            <Review key={review.id} review={review} />
          ))
        ) : (
          <div>No reviews found</div>
        )}
      </div>
    </>
  );
};

export default ReviewProvider;
