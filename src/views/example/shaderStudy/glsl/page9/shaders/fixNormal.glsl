vec3 orthogonal(vec3 v){
    return normalize(abs(v.x)>abs(v.z)?vec3(-v.y, v.x, 0.):vec3(0., -v.z, v.y));
}

vec3 fixNormal(vec3 position, vec3 distortedPosition, vec3 normal, float offset){
    vec3 tangent=orthogonal(normal);
    vec3 bitangent=normalize(cross(normal, tangent));
    vec3 neighbour1=position+tangent*offset;
    vec3 neighbour2=position+bitangent*offset;
    vec3 displacedNeighbour1=distort(neighbour1);
    vec3 displacedNeighbour2=distort(neighbour2);
    vec3 displacedTangent=displacedNeighbour1-distortedPosition;
    vec3 displacedBitangent=displacedNeighbour2-distortedPosition;
    vec3 displacedNormal=normalize(cross(displacedTangent, displacedBitangent));
    return displacedNormal;
}
