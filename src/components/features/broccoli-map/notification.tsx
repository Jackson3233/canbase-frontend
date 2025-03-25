import { useMapEvents } from 'react-leaflet';

export const MapNotification = ({
  onClick
}: {
  onClick?: (position: [number, number]) => void;
}) => {
  useMapEvents({
    click(e) {
      // Prevent the event from propagating further
      e.originalEvent.stopPropagation();
      e.originalEvent.preventDefault();

      const { lat, lng } = e.latlng;
      console.log('Double-clicked coordinates:', { lat, lng });
      onClick?.([lat, lng]);
      return false;
    }
  });

  return null;
}