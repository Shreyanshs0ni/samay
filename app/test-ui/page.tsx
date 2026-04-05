// app/test-ui/page.tsx

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function TestUI() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">UI Test</h1>

      <Button>Click Me</Button>

      <Input placeholder="Type something..." />

      <Badge>Active</Badge>

      <Card>
        <CardContent className="p-4">This is a card</CardContent>
      </Card>
    </div>
  );
}
