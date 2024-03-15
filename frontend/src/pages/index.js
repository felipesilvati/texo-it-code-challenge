'use client';
import Layout from '@/components/Layout';
import YearsWithMultipleWinners from '@/components/YearsWithMultipleWinners';
import TopThreeStudiosWithWinners from '@/components/TopThreeStudiosWithWinners';
import ProducersWithLongestAndShortest from '@/components/ProducersWithLongestAndShortest';
import ListMovieWinnersByYear from '@/components/ListMovieWinnersByYear';

export default function Dashboard() {
  const flexContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    justifyContent: 'center'
  };

  return (
    <Layout>
      <div style={flexContainerStyle}>
        <YearsWithMultipleWinners />
        <TopThreeStudiosWithWinners />
      </div>
      <div style={flexContainerStyle}>
        <ProducersWithLongestAndShortest />
        <ListMovieWinnersByYear />
      </div>
    </Layout >
  );
}
