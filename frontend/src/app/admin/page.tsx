'use client';

import { RootState } from '@/store/reducers/reducers';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUserByEmail } from './users/actions';
import {  redirect, useRouter } from 'next/navigation';
import { User } from '@/services/api';
import AdminDashboard from './Dashbaord';

const Page = () => {
  const router = useRouter();
  const userEmail = useSelector((state: RootState) => state.email);
  const [user, setUser] = useState<User | null>(null);
  if(!userEmail) redirect("/")

  useEffect(() => {
    const fetchUser = async () => {
      if (userEmail) {
        const fetchedUser = await getUserByEmail(userEmail);
        console.log(fetchedUser)
        setUser(fetchedUser);
      }
    };
    fetchUser();
  }, [userEmail]);

  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      router.push('/');
    }
  }, [user, router]);

  // Render the AdminDashboard if user exists and role is ADMIN
  if (user?.role === 'ADMIN') {
    return <AdminDashboard />;
  }

};

export default Page;
