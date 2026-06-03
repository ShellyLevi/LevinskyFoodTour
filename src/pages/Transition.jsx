import React from 'react';
import { useParams } from 'react-router-dom';
import TransitionScreen from '@/components/tour/TransitionScreen';

export default function Transition() {
  const { id } = useParams();
  return <TransitionScreen nextPath={`/station/${id}`} />;
}
