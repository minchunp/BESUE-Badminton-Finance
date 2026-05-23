export interface IShuttle {
   _id?: string;
   name: string;
   pricePerTube: number;
   pricePerPiece: number;
   quantityPerTube: number;
   createdAt?: string;
   updatedAt?: string;
}

export interface ITimeSlot {
   startHour: string;
   endHour: string;
   pricePerHour: number;
}

export interface ICourt {
   _id?: string;
   name: string;
   address?: string;
   timeSlots: ITimeSlot[];
   description?: string;
   createdAt?: string;
   updatedAt?: string;
}
