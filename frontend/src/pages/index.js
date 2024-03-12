'use client';
import { Flex } from 'antd'
import Layout from '@/components/Layout';
import YearsWithMultipleWinnersTable from '@/components/YearsWithMultipleWinnersTable';
import TopThreeStudiosWithWinnersTable from '@/components/TopThreeStudiosWithWinnersTable';
import ProducersWithLongestAndShortest from '@/components/ProducersWithLongestAndShortest';
import ListMovieWinnersByYear from '@/components/ListMovieWinnersByYear';

export default function Dashboard() {
  return (
    <Layout>
      <Flex gap='large'>
        <YearsWithMultipleWinnersTable />
        <TopThreeStudiosWithWinnersTable />
      </Flex>

      <Flex gap='large'>
        <ProducersWithLongestAndShortest />
        <ListMovieWinnersByYear />
      </Flex>
    </Layout>
  );
}
