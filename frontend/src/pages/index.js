'use client';
import { Flex } from 'antd'
import Layout from '@/components/Layout';
import YearsWithMultipleWinners from '@/components/YearsWithMultipleWinners';
import TopThreeStudiosWithWinners from '@/components/TopThreeStudiosWithWinners';
import ProducersWithLongestAndShortest from '@/components/ProducersWithLongestAndShortest';
import ListMovieWinnersByYear from '@/components/ListMovieWinnersByYear';

export default function Dashboard() {
  return (
    <Layout>
      <Flex gap='large'>
        <YearsWithMultipleWinners />
        <TopThreeStudiosWithWinners />
      </Flex>

      <Flex gap='large'>
        <ProducersWithLongestAndShortest />
        <ListMovieWinnersByYear />
      </Flex>
    </Layout>
  );
}
