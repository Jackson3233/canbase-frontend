// react-star-ratings.d.ts
declare module 'react-star-ratings' {
    import React from 'react';
  
    interface StarRatingsProps {
      rating: number;
      starRatedColor?: string;
      starEmptyColor?: string;
      starHoverColor?: string;
      changeRating: (newRating: number) => void;
      numberOfStars: number;
      starDimension?: string;
      starSpacing?: string;
      name?: string;
    }
  
    export default class StarRatings extends React.Component<StarRatingsProps> {}
  }
  