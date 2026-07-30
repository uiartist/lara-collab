<?php

namespace Database\Seeders;

use App\Actions\Material\CreateMaterial;
use Illuminate\Database\Seeder;

class MaterialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $createMaterial = new CreateMaterial();

        $materials = [
            [
                'material_name' => 'Stainless Steel Pipe 2" Dia',
                'material_description' => 'Grade 304 Stainless Steel Pipe, ASTM A312 Standard',
                'material_category' => 'Pipes & Fittings',
                'material_sub_category' => 'Pipes',
                'material_type' => 'Pipe',
                'brand' => 'Jindal Steel',
                'manufacturer' => 'Jindal Stainless Limited',
                'material_status' => 'Active',
                'uom' => 'Meter',
                'weight' => 3.85,
                'stock_item' => true,
                'current_stock' => 100,
                'reorder_level' => 20,
                'reorder_quantity' => 50,
                'minimum_stock_level' => 10,
                'maximum_stock_level' => 200,
                'warehouse' => 'Main Warehouse',
                'bin_location' => 'A-01-01',
                'purchase_rate' => 250.00,
                'standard_cost' => 250.00,
                'currency' => 'INR',
                'material_cost' => 250.00,
                'tax_percentage' => 5.00,
                'landed_cost' => 262.50,
                'gst_rate' => 5.00,
                'hsn_sac_code' => '73041100',
                'grade' => '304',
                'size' => '2"',
                'thickness' => '3.65mm',
                'technical_specifications' => 'ASTM A312, Welded, Seamless, Length: 6M/Standard',
            ],
            [
                'material_name' => 'Aluminum Sheet 1mm',
                'material_description' => 'Aluminum Alloy Sheet, 1060 H12 Temper, excellent corrosion resistance',
                'material_category' => 'Sheets & Plates',
                'material_sub_category' => 'Aluminum Sheets',
                'material_type' => 'Sheet',
                'brand' => 'Hindalco',
                'manufacturer' => 'Hindalco Industries Limited',
                'material_status' => 'Active',
                'uom' => 'Kg',
                'weight' => 2.7,
                'stock_item' => true,
                'current_stock' => 500,
                'reorder_level' => 50,
                'reorder_quantity' => 200,
                'minimum_stock_level' => 25,
                'maximum_stock_level' => 800,
                'warehouse' => 'Main Warehouse',
                'bin_location' => 'B-02-03',
                'purchase_rate' => 185.00,
                'standard_cost' => 185.00,
                'currency' => 'INR',
                'material_cost' => 185.00,
                'tax_percentage' => 5.00,
                'landed_cost' => 194.25,
                'gst_rate' => 5.00,
                'hsn_sac_code' => '76042990',
                'grade' => '1060 H12',
                'color' => 'Silver',
                'size' => '1000 x 2000mm',
                'thickness' => '1mm',
                'density' => '2.7 g/cm³',
                'technical_specifications' => 'Alloy 1060, Temper H12, Surface: Mill Finish, ISO certified',
            ],
            [
                'material_name' => 'Mild Steel Angle 50x50x5',
                'material_description' => 'Structural Mild Steel Equal Angle, Galvanized for corrosion resistance',
                'material_category' => 'Structural Steel',
                'material_sub_category' => 'Angles',
                'material_type' => 'Angle',
                'brand' => 'SAIL Bhilai',
                'manufacturer' => 'Steel Authority of India Limited',
                'material_status' => 'Active',
                'uom' => 'Meter',
                'weight' => 3.77,
                'stock_item' => true,
                'current_stock' => 250,
                'reorder_level' => 30,
                'reorder_quantity' => 100,
                'minimum_stock_level' => 15,
                'maximum_stock_level' => 400,
                'warehouse' => 'Main Warehouse',
                'bin_location' => 'C-03-02',
                'purchase_rate' => 42.00,
                'standard_cost' => 42.00,
                'currency' => 'INR',
                'material_cost' => 42.00,
                'tax_percentage' => 5.00,
                'landed_cost' => 44.10,
                'gst_rate' => 5.00,
                'hsn_sac_code' => '72211010',
                'grade' => 'IS 1730 Grade A',
                'size' => '50 x 50 x 5mm',
                'thickness' => '5mm',
                'strength_rating' => '250 MPa',
                'technical_specifications' => 'Equal Angle Section, Hot Rolled, Galvanized, IS 1730 Standard',
            ],
        ];

        foreach ($materials as $material) {
            $createMaterial->create($material);
        }
    }
}

