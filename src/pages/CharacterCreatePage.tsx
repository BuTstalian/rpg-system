import { useParams } from 'react-router-dom';
import { CharacterCreator } from '@/components/character/CharacterCreator';

export function CharacterCreatePage() {
  const { campaignId } = useParams();

  return (
    <div className="min-h-screen py-8">
      <CharacterCreator campaignId={campaignId} />
    </div>
  );
}
