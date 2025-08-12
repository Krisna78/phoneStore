<?php

namespace Database\Seeders;

use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Seeder;

use App\Models\User;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::create([
            'name'      => 'Hesh_cp',
            'email'     => 'heshcp88@gmail.com',
            'password'  => Hash::make('password'),
            'phone' => "081237059623",
            'address' => "jl.semangka"
        ]);

        //get all permissions
        $permissions = Permission::all();
        //get role admin
        $role = Role::find(1);
        //assign permission to role
        $role->syncPermissions($permissions);
        //assign role to user
        $user->assignRole($role);
    }
}
