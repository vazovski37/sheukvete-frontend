'use client';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboard() {
  return (
    <div className="h-screen p-4">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50} className="p-2">
          <Card>
            <CardHeader>
              <CardTitle>Sold Quantities</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">158</p>
              <p className="text-sm text-muted-foreground">Items sold today</p>
            </CardContent>
          </Card>
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={50} className="p-2">
          <Card>
            <CardHeader>
              <CardTitle>Waiter Work Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                <li>John Doe: <strong>6 hrs</strong></li>
                <li>Jane Smith: <strong>8 hrs</strong></li>
                <li>Mark Taylor: <strong>5 hrs</strong></li>
              </ul>
            </CardContent>
          </Card>
        </ResizablePanel>
      </ResizablePanelGroup>

      <div className="mt-4">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={50} className="p-2">
            <Card>
              <CardHeader>
                <CardTitle>Today's Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">$1,280</p>
                <p className="text-sm text-muted-foreground">Total sales revenue</p>
              </CardContent>
            </Card>
          </ResizablePanel>

          <ResizableHandle />

          <ResizablePanel defaultSize={50} className="p-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Items</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal ml-4">
                  <li>Burger (45 sold)</li>
                  <li>Cappuccino (32 sold)</li>
                  <li>Pasta (28 sold)</li>
                </ol>
              </CardContent>
            </Card>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
