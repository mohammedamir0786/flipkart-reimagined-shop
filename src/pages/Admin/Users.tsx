
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const usersMockData = [
  { id: 1, name: "John Doe", email: "john@example.com", joined: "10 Jan 2023" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", joined: "15 Feb 2023" },
  { id: 3, name: "Robert Johnson", email: "robert@example.com", joined: "22 Mar 2023" },
  { id: 4, name: "Emily Davis", email: "emily@example.com", joined: "05 Apr 2023" },
  { id: 5, name: "Michael Brown", email: "michael@example.com", joined: "18 May 2023" },
];

const Users = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-gray-500">Manage registered users</p>
      </div>
      
      {/* Users table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usersMockData.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.joined}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Users;
