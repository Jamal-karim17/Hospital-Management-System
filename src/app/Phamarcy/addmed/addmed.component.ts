import { Component } from '@angular/core';
import { PhamarcyService } from 'src/app/Services/phamarcy.service';

@Component({
  selector: 'app-addmed',
  templateUrl: './addmed.component.html',
  styleUrls: ['./addmed.component.css']
})
export class AddmedComponent {
  medicine: any = {
    genericName: '',
    brandName: '',
    dosageForm: '',
    stock: 0,
    manufacturer: '',
    price: 0,
    image: ''
  };

  constructor(private pharmacyService: PhamarcyService) {}

  // Handle the image selection and convert it to Base64
  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.convertToBase64(file)
        .then(base64Image => {
          // Store the Base64 string in medicine's image field
          this.medicine.image = base64Image;
        })
        .catch(error => {
          console.error('Error converting image to Base64:', error);
        });
    }
  }

  // Convert the selected image to Base64 format
  convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        const base64Image = reader.result as string;
        resolve(base64Image);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      // Read the image file as a data URL (Base64 format)
      reader.readAsDataURL(file);
    });
  }

  // Add the medicine to the list and reset the form
  addMedicine() {
    if (this.medicine.image) {
      // Add the medicine to the pharmacy service
      this.pharmacyService.addMedicine(this.medicine);

      // Reset the medicine form after adding
      this.medicine = {
        genericName: '',
        brandName: '',
        dosageForm: '',
        stock: 0,
        manufacturer: '',
        price: 0,
        image: ''
      };
    } else {
      alert('Please select an image.');
    }
  }
}
